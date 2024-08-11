import fs from "fs";
import User from "./../../models/user.js";
import Course from "./../../models/course.js";
import CourseCategory from "./../../models/courseCategory.js";
import CourseSeason from "./../../models/courseSeason.js";
import CourseEpisode from "./../../models/courseEpisode.js";
import controller from "./../controller.js";
import path from "path";
import itIsImage from "../../utils/itIsImage.js";
import CourseArticle from "../../models/courseArticle.js";
import Disscount from "../../models/disscount.js";

async function createDisscount(
  amount = null,
  price = null,
  startDisscountDate,
  endDisscountDate,
  type,
  coursesId = null,
  enableFor,
  courseId = null,
  teacherId
) {
  const teacherFound = await User.findById(teacherId);
  const disscountObj = {
    startDisscountDate,
    endDisscountDate,
    type,
    enableFor,
    status:
      startDisscountDate == moment().format("jYYY/jMM/jDD")
        ? "started"
        : "not-yet",
  };

  if (enableFor == "all") {
    const coursesForTeacher = await Course.find({
      courseInstructor: teacherFound,
    });

    disscountObj.courses = coursesForTeacher;

    if (type == "percent") {
      disscountObj.amount = amount;
      const newDisscount = new Disscount(disscountObj);
      for (let course of coursesForTeacher) {
        course.disscount = newDisscount;
        await course.save();
      }
      await newDisscount.save();

      return newDisscount;
    } else if (type == "toman") {
      disscountObj.price = price;
      const newDisscount = new Disscount(disscountObj);
      for (let course of coursesForTeacher) {
        course.disscount = newDisscount;
        await course.save();
      }
      await newDisscount.save();

      return newDisscount;
    }
  } else if (enableFor == "some") {
    let course;
    const coursesForDisscount = [];
    for (let courseId of coursesId) {
      course = await Course.findOne({
        _id: courseId,
        courseInstructor: teacherFound,
      });
      coursesForDisscount.push(course);
    }

    disscountObj.courses = coursesForDisscount;

    if (type == "percent") {
      disscountObj.amount = amount;
      const newDisscount = new Disscount(disscountObj);
      for (let course of coursesForDisscount) {
        course.disscount = newDisscount;
        await course.save();
      }
      await newDisscount.save();

      return newDisscount;
    } else if (type == "toman") {
      disscountObj.price = price;
      const newDisscount = new Disscount(disscountObj);
      for (let course of coursesForDisscount) {
        course.disscount = newDisscount;
        await course.save();
      }
      await newDisscount.save();

      return newDisscount;
    }
  } else if (enableFor == "one") {
    const courseFound = await Course.findById(courseId);

    disscountObj.courses = [courseFound];

    if (type == "percent") {
      disscountObj.amount = amount;
      const newDisscount = new Disscount(disscountObj);

      courseFound.disscount = newDisscount;

      await newDisscount.save();
      await courseFound.save();

      return newDisscount;
    } else if (type == "toman") {
      disscountObj.price = price;
      const newDisscount = new Disscount(disscountObj);

      courseFound.disscount = newDisscount;

      await newDisscount.save();
      await courseFound.save();

      return newDisscount;
    }
  }
}

export default new (class extends controller {
  async getCourses(req, res) {
    const category = req.query.category || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    if (category == null) {
      const courses = await Course.find()
        .populate("user")
        .populate("course-comment")
        .populate("course-season")
        .populate("course-category")
        .limit(limit)
        .skip((page - 1) * limit);

      const coursesCount = await Course.countDocuments();

      let pagesCount = 1;

      if (coursesCount > 6) pagesCount = coursesCount / 6;

      this.response({
        data: {
          courses,
          page,
          pagesCount,
        },
        res,
      });
    } else {
      const categoryFound = await CourseCategory.findOne({ name: category });
      if (categoryFound) {
        const courses = await Course.find({ category: categoryFound })
          .populate("user")
          .populate("course-comment")
          .populate("course-season")
          .populate("course-category")
          .limit(limit)
          .skip((page - 1) * limit);

        const coursesCount = Course.countDocuments();

        let pagesCount = 1;

        if (coursesCount > 6) pagesCount = coursesCount / 6;
        this.response({
          data: courses,
          res,
        });
      } else {
        this.response({
          code: 404,
          message: "not found error",
          errors: [
            {
              field: "category",
              message: "دسته بندی مدنظر وجود ندارد",
            },
          ],
          res,
        });
      }
    }
  }

  async getOneCourse(req, res) {
    const { name } = req.params;
    const courseFound = await Course.findOne({ name }).populate(
      "category",
      "name"
    );

    if (courseFound) {
      this.response({
        data: courseFound,
        res,
      });
    } else {
      this.response({
        code: 404,
        message: "not found error",
        errors: [
          {
            field: "name",
            error: "دوره ای با این نام یافت نشد",
          },
        ],
        res,
      });
    }
  }

  async addCategory(req, res) {
    const { name, title } = req.body;

    const categoryFound = await CourseCategory.findOne({ name });
    if (categoryFound) {
      this.response({
        code: 400,
        message: "exists error",
        errors: [
          {
            field: "name",
            error: "دسته بندی ای با این نام وجود دارد",
          },
        ],
        res,
      });
    } else {
      const newCategory = new CourseCategory({ name, title });

      await newCategory.save();

      this.response({
        data: newCategory,
        res,
      });
    }
  }

  async postCourse(req, res) {
    const {
      name,
      title,
      category,
      description,
      viewType,
      supportType,
      requirements,
      courseStatus,
    } = req.body;

    let thumbnailFileName;

    try {
      thumbnailFileName = req.files ? req.files["thumbnail"].name : "";
    } catch {
      thumbnailFileName = null;
    }
    if (thumbnailFileName) {
      const { thumbnail } = req.files;

      if (itIsImage(thumbnailFileName)) {
        const categoryFound = await CourseCategory.findOne({ name: category });
        if (categoryFound) {
          const courseFound = await Course.findOne({ name });
          if (courseFound) {
            this.response({
              code: 400,
              message: "exists error",
              errors: [
                {
                  field: "name",
                  error: "دوره ای با نام مدنظر وجود دارد",
                },
              ],
              res,
            });
          } else {
            const courseFoundWithThisTitle = await Course.findOne({ title });
            if (courseFoundWithThisTitle) {
              this.response({
                code: 400,
                message: "validation error",
                errors: [
                  {
                    field: "title",
                    error: "دوره ای با عنوان مدنظر وجود دارد",
                  },
                ],
              });
            } else {
              const userFound = await User.findById(req.user._id);
              const newCourse = new Course({
                name,
                title,
                description,
                properties: {
                  viewType,
                  supportType,
                  requirements,
                  courseStatus,
                },
                category: categoryFound,
                courseInstructor: userFound,
                thumbnail: null,
              });

              userFound.teacherCourses.push(newCourse);

              fs.mkdirSync(`./public/media/courses/${newCourse._id}`);
              fs.mkdirSync(`./public/media/courses/${newCourse._id}/thumbnail`);
              fs.mkdirSync(`./public/media/courses/${newCourse._id}/seasons`);
              fs.mkdirSync(
                `./public/media/courses/${newCourse._id}/article-files`
              );

              thumbnail.mv(
                `./public/media/courses/${
                  newCourse._id
                }/thumbnail/thumbnail${path.extname(thumbnail.name)}`
              );

              newCourse.thumbnail = `/media/courses/${
                newCourse._id
              }/thumbnail/thumbnail${path.extname(thumbnail.name)}`;

              await newCourse.save();
              await userFound.save();

              this.response({
                data: newCourse,
                res,
              });
            }
          }
        } else {
          this.response({
            code: 404,
            message: "not found error",
            errors: [
              {
                field: "category",
                error: "دسته بندی مدنظر وجود ندارد",
              },
            ],
            res,
          });
        }
      } else {
        this.response({
          code: 400,
          message: "validation error",
          errors: [
            {
              field: "thumbnail",
              error: "فایل تامنیل آپلود شده یک فایل تصویری نمی باشد",
            },
          ],
          res,
        });
      }
    } else {
      this.response({
        code: 400,
        message: "validation error",
        errors: [
          {
            field: "thumbnail",
            error: "فایل تامنیل آپلود نشده است",
          },
        ],
        res,
      });
    }
  }

  async addArticleToCourse(req, res) {
    const { courseId, content } = req.body;
    const files = req.files;

    const courseFound = await Course.findById(courseId);

    if (courseFound) {
      const articleFiles =
        files.length == 0
          ? []
          : files.map((file, index) => {
              return {
                url: `/media/courses/${
                  courseFound._id
                }/article-files/f${index}${path.extname(file.name)}`,
              };
            });

      const newCourseArticle = new CourseArticle({
        course: courseFound,
        content,
        files: articleFiles,
      });

      if (articleFiles.length != 0) {
        files.forEach((file, index) => {
          file.mv(path.join("./public", articleFiles[index].url));
        });
      }

      courseFound.article = newCourseArticle;

      await newCourseArticle.save();
      await courseFound.save();

      this.response({
        data: courseFound,
        res,
      });
    } else {
      this.response({
        code: 404,
        message: "not found error",
        errors: [
          {
            field: "courseId",
            error: "دوره ای با آیدی مدنظر یافت نشد",
          },
        ],
        res,
      });
    }
  }

  async editCourse(req, res) {
    const {
      name,
      title,
      category,
      description,
      viewType,
      supportType,
      requirements,
      courseStatus,
    } = req.body;

    const courseFound = await Course.findOne({ name });
    if (courseFound) {
      courseFound.title = title;
      courseFound.description = description;
      courseFound.properties.viewType = viewType;
      courseFound.properties.supportType = supportType;
      courseFound.properties.requirements = requirements;
      courseFound.properties.courseStatus = courseStatus;

      if (category != courseFound.category.name) {
        const categoryFound = await CourseCategory.findOne({ name: category });
        if (categoryFound) {
          courseFound.category = categoryFound;
          this.response({
            data: courseFound,
            res,
          });
        } else {
          this.response({
            code: 400,
            message: "validation error",
            errors: [
              {
                field: "category",
                error: "دسته بندی مدنظر وجود ندارد",
              },
            ],
            res,
          });
        }
      } else {
        this.response({
          data: courseFound,
          res,
        });
      }
    } else {
      this.response({
        code: 404,
        message: "not found error",
        errors: [
          {
            field: "name",
            error: "دوره ای با نام مورد نظر یافت نشد",
          },
        ],
        res,
      });
    }
  }

  async changeTumbnailOfCourse(req, res) {
    let thumbnailFileName;

    try {
      thumbnailFileName = req.files ? req.files["thumbnail"].name : "";
    } catch {
      this.response({
        code: 400,
        message: "validation error",
        errors: [
          {
            field: "thumbnail",
            error:
              "فایل تامنیل آپلود نشده یا در قالب فیلد تامنیل ارسال نشده است",
          },
        ],
        res,
      });
    }

    if (thumbnailFileName) {
      const { courseId } = req.body;
      const { thumbnail } = req.files;
      if (itIsImage(thumbnailFileName)) {
        fs.rmSync(`./public/media/courses/${courseId}/thumbnail`, {
          recursive: true,
          force: true,
        });
        fs.mkdirSync(`./public/media/courses/${courseId}/thumbnail`);

        thumbnail.mv(
          `./public/media/courses/${courseId}/thumbnail/${thumbnailFileName}`
        );

        const courseFound = await Course.findById(courseId);

        courseFound.thumbnail = `/media/courses/${courseId}/thumbnail/${thumbnailFileName}`;

        await courseFound.save();

        this.response({
          data: courseFound,
          res,
        });
      } else {
        this.response({
          code: 400,
          message: "validation error",
          errors: [
            {
              field: "thumbnail",
              error: "فایل تامنیل آپلود شده یک فایل تصویری نمی باشد ",
            },
          ],
          res,
        });
      }
    } else {
      this.response({
        code: 400,
        message: "validation error",
        errors: [
          {
            field: "thumbnail",
            error: "فایل تامنیل آپلود نشده است",
          },
        ],
        res,
      });
    }
  }

  async addSeasonToCourse(req, res) {
    const { title, courseId } = req.body;

    const courseFound = await Course.findById(courseId);
    const newSeason = new CourseSeason({
      title,
      course: courseFound._id,
      episodes: [],
      season: courseFound.seasons.length + 1,
    });

    fs.mkdirSync(
      `./public/media/courses/${courseFound._id}/seasons/${
        courseFound.seasons.length + 1
      }`
    );

    courseFound.seasons.push(newSeason);

    await newSeason.save();
    await courseFound.save();

    this.response({
      data: courseFound,
      res,
    });
  }

  async createDisscount(req, res) {
    const { type, enableFor, startDisscountDate, endDisscountDate } = req.body;

    if (type == "percent" && req.body?.amount) {
      const { amount } = req.body;
      if (enableFor !== "all") {
        if (req.body?.coursesId || req.body?.courseId) {
          const newDisscount = await createDisscount(
            amount,
            null,
            startDisscountDate,
            endDisscountDate,
            type,
            req.body?.coursesId ? req.body.coursesId : null,
            enableFor,
            req.body?.courseId ? req.body.courseId : null,
            req.user._id
          );

          this.response({
            data: newDisscount,
            res,
          });
        } else {
          this.response({
            code: 400,
            message: "validation error",
            errors: [
              {
                field: "courseId",
                error:
                  "شما باید یا یک دوره یا چند دوره را در صورتی که نمیخواهید کل دوره ها تخفیف داشته باشند انتخاب کنید",
              },
              {
                field: "coursesId",
                error:
                  "شما باید یا یک دوره یا چند دوره را در صورتی که نمیخواهید کل دوره ها تخفیف داشته باشند انتخاب کنید",
              },
            ],
            res,
          });
        }
      } else {
        const newDisscount = await createDisscount(
          amount,
          null,
          startDisscountDate,
          endDisscountDate,
          type,
          req.body?.coursesId ? req.body.coursesId : null,
          enableFor,
          req.body?.courseId ? req.body.courseId : null,
          req.user._id
        );

        this.response({
          data: newDisscount,
          res,
        });
      }
    } else if (type == "toman" && req.body?.price) {
      if (enableFor !== "all") {
        if (req.body?.coursesId || req.body?.courseId) {
          const newDisscount = await createDisscount(
            amount,
            null,
            startDisscountDate,
            endDisscountDate,
            type,
            req.body?.coursesId ? req.body.coursesId : null,
            enableFor,
            req.body?.courseId ? req.body.courseId : null,
            req.user._id
          );

          this.response({
            data: newDisscount,
            res,
          });
        } else {
          this.response({
            code: 400,
            message: "validation error",
            errors: [
              {
                field: "courseId",
                error:
                  "شما باید یا یک دوره یا چند دوره را در صورتی که نمیخواهید کل دوره ها تخفیف داشته باشند انتخاب کنید",
              },
              {
                field: "coursesId",
                error:
                  "شما باید یا یک دوره یا چند دوره را در صورتی که نمیخواهید کل دوره ها تخفیف داشته باشند انتخاب کنید",
              },
            ],
            res,
          });
        }
      } else {
        const newDisscount = await createDisscount(
          amount,
          null,
          startDisscountDate,
          endDisscountDate,
          type,
          req.body?.coursesId ? req.body.coursesId : null,
          enableFor,
          req.body?.courseId ? req.body.courseId : null,
          req.user._id
        );

        this.response({
          data: newDisscount,
          res,
        });
      }
    } else {
      this.response({
        code : 400,
        message : 'validation error',
        errors : [
          {
            field : 'amount',
            error : 'اگر نوع تخفیف شما درصد است باید amount را ارسال کنید'
          },
          {
            field : 'price',
            error : 'اگر نوع تخفیف شما تومن است باید price را ارسال کنید'
          }
        ],
        res
      });
    }
  }

  async editSeason(req, res) {
    const { courseId, season, newTitle } = req.body;
    const courseFound = await Course.findById(courseId).populate(
      "course-season"
    );
    const seasonFound = await CourseSeason.findOne({
      season,
    }).populate("course");

    seasonFound.name = newTitle;
    courseFound.seasons[season] = seasonFound;

    await seasonFound.save();
    await courseFound.save();

    this.response({
      data: courseFound,
      res,
    });
  }

  async addEpisodeToSeason(req, res) {
    const { title, seasonId, description } = req.body;

    let video;
    try {
      video = req.files;
    } catch {
      video = null;
    }

    if (video) {
      const seasonFound = await CourseSeason.findById(seasonId)
        .populate("course")
        .populate("course-episode");

      if (seasonFound) {
        const courseFound = await Course.findById(seasonFound.course._id)
          .populate("course-season")
          .populate("course-category")
          .populate("course-comment");

        video.mv(
          `./public/media/courses/${courseFound._id}/${seasonFound.season}/${
            seasonFound.episodes.length + 1
          }${path.extname(video.name)}`
        );

        const newEpisode = new CourseEpisode({
          title,
          description,
          season: seasonFound,
          comments: [],
          video: `/media/courses/${courseFound._id}/${seasonFound.season}/${
            seasonFound.episodes.length + 1
          }${path.extname(video.name)}`,
        });

        seasonFound.episodes.push(newEpisode);
        courseFound.seasons[seasonFound.season - 1] = seasonFound;

        await newEpisode.save();
        await seasonFound.save();
        await courseFound.save();

        this.response({
          data: courseFound,
          res,
        });
      } else {
        this.response({
          code: 404,
          message: "not found error",
          errors: [
            {
              field: "seasonId",
              error: "فصلی با این Id پیدا نشد",
            },
          ],
        });
      }
    } else {
      this.response({
        code: 400,
        message: "validation error",
        errors: [
          {
            field: "video",
            error: "ویدیو ای در فیلد ویدیو موجود نیست یا به درستی ارسال نشده",
          },
        ],
        res,
      });
    }
  }
})();

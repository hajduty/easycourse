import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import course from "../../assets/course.png";
import quiz from "../../assets/quiz.png";

export const HomePage = () => {
  const categories = ["AI", "Python", "Web Dev", "Data", "Design"];

  return (
    <div className="">
      <section className="min-h-screen -mt-16 grid place-items-center px-6 relative hero-grid-bg hero-fade">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-neutral-100 tracking-tight">
            Create. Share. Learn.
          </h1>
          <p className="mt-4 max-w-xl text-neutral-400 text-lg md:text-xl">
            Free courses and tutorials built by the community.
          </p>
          <Link to="/course">
            <Button
              size="lg"
              className="mt-8 bg-neutral-900 text-neutral-100 border border-neutral-700
                         hover:bg-neutral-700 active:bg-neutral-800 transition"
            >
              Browse courses
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2
                  text-neutral-500 animate-bounce">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-neutral-100 mb-16 text-center">
            Build anything you want
          </h2>
          <div className="space-y-24">
            {/* Create a course */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-neutral-100 mb-4">
                  Create a course
                </h3>
                <p className="text-neutral-400 text-lg leading-relaxed">
                  Build comprehensive courses with our intuitive section builder.
                  Add videos, text, code examples, and quizzes to create engaging
                  learning experiences.
                </p>
              </div>
              <div className="bg-neutral-900 rounded-lg border border-neutral-800 flex items-center justify-center">
                <img className="text-neutral-600 text-center rounded-lg" src={course}>
                </img>
              </div>
            </div>

            {/* Create a quiz */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className=" border-neutral-800 rounded-lg aspect-auto flex items-center justify-center md:order-first">
                <img className="text-neutral-600 scale-75" src={quiz}>
                </img>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-neutral-100 mb-4">
                  Create quizzes
                </h3>
                <p className="text-neutral-400 text-lg leading-relaxed">
                  Design quizzes with multiple choice, true/false,
                  and open-ended questions. Track progress and provide
                  instant feedback to enhance learning.
                </p>
              </div>
            </div>

            {/* Create a problem */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-neutral-100 mb-4">
                  Create a problem
                </h3>
                <p className="text-neutral-400 text-lg leading-relaxed">
                  Challenge learners with coding problems and exercises. Set up
                  test cases, provide starter code, and let students practice
                  their skills with immediate validation.
                </p>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 aspect-video flex items-center justify-center">
                <div className="text-neutral-600 text-center">
                  <div className="text-6xl mb-4">x</div>
                  <p className="text-sm">Code Problem Solver Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-neutral-100 mb-8">
            Explore categories
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                to={`/category/${cat.toLowerCase()}`}
                key={cat}
                className="px-5 py-2 rounded-full bg-neutral-900 text-neutral-300
                         border border-neutral-700 hover:bg-neutral-700 hover:text-neutral-100
                         transition"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-neutral-100 mb-12 text-center">
            Top user rated courses
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for CourseCard components */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 h-64 flex items-center justify-center">
              <p className="text-neutral-600">CourseCard Component</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 h-64 flex items-center justify-center">
              <p className="text-neutral-600">CourseCard Component</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 h-64 flex items-center justify-center">
              <p className="text-neutral-600">CourseCard Component</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

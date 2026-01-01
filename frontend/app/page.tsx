import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50/50 text-gray-800 flex flex-col justify-center font-sans">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          HireLens
        </h1>
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
          An explainable resume–job description matching platform
        </p>
        <Link
          href="/jobs"
          className="bg-gray-900 text-white text-base font-medium px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
        >
          Get Started
        </Link>
      </section>

      {/* Action Cards */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <Link href="/jobs" className="block group">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all h-full">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">Create Job</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Define the role requirements and mandatory skills.
              </p>
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/resumes" className="block group">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all h-full">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">Upload Resume</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Parse candidate resumes to automatically extract skills.
              </p>
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="/matches" className="block group">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all h-full">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">Get Matched</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                View instant, explainable compatibility scores.
              </p>
            </div>
          </Link>

        </div>
      </section>
    </main>
  );
}

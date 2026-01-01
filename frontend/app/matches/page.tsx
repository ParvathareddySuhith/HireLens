"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MatchPage() {
    const [jobId, setJobId] = useState("");
    const [resumeId, setResumeId] = useState("");
    const [result, setResult] = useState<any>(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [jobs, setJobs] = useState<any[]>([]);
    const [resumes, setResumes] = useState<any[]>([]);

    // Fetch lists on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, resumesRes] = await Promise.all([
                    axios.get("http://localhost:8000/jobs/"),
                    axios.get("http://localhost:8000/resumes/")
                ]);
                setJobs(jobsRes.data);
                setResumes(resumesRes.data);
            } catch (err) {
                console.error("Failed to fetch lists", err);
            }
        };
        fetchData();
    }, []);

    const handleMatch = async (e: React.FormEvent) => {
        e.preventDefault();
        setResult(null);
        setMessage("");
        setError("");
        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:8000/matches/", {
                job_id: parseInt(jobId),
                resume_id: parseInt(resumeId),
            });
            setResult(response.data);
            setMessage("Match calculated successfully!");
        } catch (err: any) {
            setError(err.response?.data?.detail || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setJobId("");
        setResumeId("");
        setMessage("");
        setError("");
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50/50 flex flex-col items-center font-sans">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-sm mb-8">
                <h1 className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">Match Candidates</h1>
                <p className="text-sm text-gray-500 mb-8 bg-blue-50/50 p-3 rounded-lg text-center leading-relaxed">
                    HireLens uses rule-based skill matching for transparent and explainable results.
                </p>

                <form onSubmit={handleMatch} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Job</label>
                            <select
                                className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                                value={jobId}
                                onChange={(e) => setJobId(e.target.value)}
                                required
                            >
                                <option value="">-- Select a Job --</option>
                                {jobs.map((job) => (
                                    <option key={job.id} value={job.id}>
                                        #{job.id} - {job.title}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-400 mt-2">Select from available jobs</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Resume</label>
                            <select
                                className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                                value={resumeId}
                                onChange={(e) => setResumeId(e.target.value)}
                                required
                            >
                                <option value="">-- Select a Resume --</option>
                                {resumes.map((resume) => (
                                    <option key={resume.id} value={resume.id}>
                                        #{resume.id} - {resume.candidate_name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-400 mt-2">Select from uploaded resumes</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white font-medium p-3 rounded-lg transition-colors shadow-sm ${isLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                        {isLoading ? "Matching..." : "Run Match"}
                    </button>
                </form>

                {message && (
                    <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg text-center text-sm font-medium">
                        <p>{message}</p>
                    </div>
                )}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg text-center text-sm font-medium">
                        <p>{error}</p>
                    </div>
                )}
            </div>

            {result && (
                <div className="w-full max-w-2xl bg-white rounded-xl shadow overflow-hidden mt-4">
                    <div className="p-8 text-center bg-gray-50/50">
                        <h2 className="text-gray-500 uppercase tracking-widest text-xs font-semibold mb-3">Match Score</h2>
                        <span className="text-6xl font-bold text-blue-600 tracking-tight">{result.score}%</span>
                        <p className="mt-4 text-gray-600 italic text-sm">{result.explanation}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 text-sm divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <div className="p-8 bg-green-50/30">
                            <h3 className="font-bold text-green-700 mb-4 flex items-center text-base">
                                <span className="mr-2">✓</span> Matched Skills
                            </h3>
                            <ul className="space-y-3">
                                {result.matched_skills.length > 0 ? (
                                    result.matched_skills.map((s: string) => (
                                        <li key={s} className="flex items-center text-gray-700">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                            {s}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 italic">None</li>
                                )}
                            </ul>
                        </div>

                        <div className="p-8 bg-red-50/30">
                            <h3 className="font-bold text-red-700 mb-4 flex items-center text-base">
                                <span className="mr-2">✗</span> Missing Skills
                            </h3>
                            <ul className="space-y-3">
                                {result.missing_skills.length > 0 ? (
                                    result.missing_skills.map((s: string) => (
                                        <li key={s} className="flex items-center text-gray-700">
                                            <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                                            {s}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 italic">None</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50/50 text-center border-t border-gray-100">
                        <button
                            onClick={handleReset}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-colors"
                        >
                            Run Another Match
                        </button>
                    </div>
                </div>
            )
            }

            <a href="/" className="block mt-12 text-center text-sm text-gray-500 hover:text-gray-800 transition-colors">← Back to Dashboard</a>
        </div>
    );
}

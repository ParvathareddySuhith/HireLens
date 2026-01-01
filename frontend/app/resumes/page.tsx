"use client";
import { useState } from "react";
import axios from "axios";

export default function UploadResumePage() {
    const [userId, setUserId] = useState(1);
    const [candidateName, setCandidateName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setIsLoading(true);

        if (!file) {
            setError("Please select a file.");
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("user_id", userId.toString());
        formData.append("candidate_name", candidateName);
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:8000/resumes/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage(`Resume uploaded successfully! ID: ${response.data.id}`);
        } catch (err: any) {
            setError(err.response?.data?.detail || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50/50 flex flex-col items-center font-sans">
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-sm">
                <h1 className="text-2xl font-bold mb-8 text-gray-900 tracking-tight">Upload Resume</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Name</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            required
                        />
                        <p className="text-xs text-gray-400 mt-2">Full name of the candidate</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Resume File (PDF/TXT)</label>
                        <input
                            type="file"
                            accept=".pdf,.txt"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={handleFileChange}
                            required
                        />
                        <p className="text-xs text-gray-400 mt-2">Supported formats: PDF, TXT</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white font-medium p-3 rounded-lg transition-colors shadow-sm ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isLoading ? "Uploading resume..." : "Upload Resume"}
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

                <a href="/" className="block mt-8 text-center text-sm text-gray-500 hover:text-gray-800 transition-colors">← Back to Dashboard</a>
            </div>
        </div>
    );
}

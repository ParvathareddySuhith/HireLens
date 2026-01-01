"use client";
import { useState } from "react";
import axios from "axios";

export default function CreateJobPage() {
    const [formData, setFormData] = useState({
        user_id: 1, // Default user ID for testing
        title: "",
        description: "",
        required_skills: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:8000/jobs/", formData);
            setMessage(`Job created successfully! ID: ${response.data.id}`);
            // Optional: Clear form on success
            setFormData({ ...formData, title: "", description: "", required_skills: "" });
        } catch (err: any) {
            setError(err.response?.data?.detail || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50/50 flex flex-col items-center font-sans">
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-sm">
                <h1 className="text-2xl font-bold mb-8 text-gray-900 tracking-tight">Create Job</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                        <input
                            name="title"
                            type="text"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                        <p className="text-xs text-gray-400 mt-2">e.g. "Senior Python Developer"</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            className="w-full p-3 border border-gray-200 rounded-lg h-40 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                        <input
                            name="required_skills"
                            type="text"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                            placeholder="python, fastapi, mysql"
                            value={formData.required_skills}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-gray-400 mt-2">Comma-separated skills (e.g. "python, react, sql")</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white font-medium p-3 rounded-lg transition-colors shadow-sm ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isLoading ? "Creating Job..." : "Create Job"}
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

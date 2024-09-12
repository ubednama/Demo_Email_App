import { useState } from "react";
import axios from "axios";

export default function EmailComposer() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !emailMessage) {
      setError("Please fill in all fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setSuccess("");
    const body = { email, subject, emailMessage };
    try {
      const response = await axios.post("http://localhost:5001/send", body);
      console.log("Response from server:", response.data);
      setSuccess("Email sent successfully!");
      setEmail("");
      setSubject("");
      setEmailMessage("");
    } catch (error) {
      console.error("Error sending email:", error);
      setError("Failed to send email. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Compose Email
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Recipient Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
                placeholder="Recipient Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-700"
              >
                Email Body
              </label>
              <textarea
                id="body"
                name="body"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
                placeholder="Email Body"
                rows={5}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center text-sm text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center text-sm text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {success}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Send Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function EmailComposer() {
  const [emails, setEmails] = useState([""]);
  const [subject, setSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emails.some((email) => !email) || !emailMessage) {
      setError("Please fill in all fields");
      return;
    }
    if (emails.some((email) => !/\S+@\S+\.\S+/.test(email))) {
      setError("Please enter valid email addresses");
      return;
    }
    if (new Set(emails).size !== emails.length) {
      setError("Please ensure all email addresses are unique");
      return;
    }
    setError("");
    setSuccess("");
    const body = { emails, subject, emailMessage };
    try {
      const response = await fetch("/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Response from server:", data);
      setSuccess("Email sent successfully!");
      setEmails([""]);
      setSubject("");
      setEmailMessage("");
    } catch (error) {
      console.error("Error sending email:", error);
      setError("Failed to send email. Please try again.");
    }
  };

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const removeEmailField = (index) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const updateEmail = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">Compose Email</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {emails.map((email, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  id={`email-${index}`}
                  name={`email-${index}`}
                  type="email"
                  autoComplete="email"
                  required
                  className="flex-grow w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Recipient Email"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value)}
                />
                <button
                  type="button"
                  className="px-2 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => removeEmailField(index)}
                  aria-label="Remove email"
                  disabled={emails.length === 1}
                >
                  -
                </button>
                {index === emails.length - 1 && (
                  <button
                    type="button"
                    className="px-2 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={addEmailField}
                    aria-label="Add another email"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
            <input
              id="subject"
              name="subject"
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              id="body"
              name="body"
              required
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email Body"
              rows={5}
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
            />
          </div>

          {error && (
            <div className="flex items-center text-sm text-red-500">
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
            <div className="flex items-center text-sm text-green-500">
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

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Send Email
          </button>
        </form>
      </div>
    </div>
  );
}
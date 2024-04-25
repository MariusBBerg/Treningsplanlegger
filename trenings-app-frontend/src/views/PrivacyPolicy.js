import React from "react";
import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col justify-between min-h-screen bg-theme px-6 pt-14 lg:px-8 w-full">
      <Navigation />

      <div>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-2">Last updated: 25.04.2024</p>

        <h2 className="mt-4 text-2xl font-bold">1. Information We Collect</h2>
        <h3 className="mt-2 text-xl font-semibold">Information You Provide to Us:</h3>
        <ul className="list-disc ml-5">
          <li>Account Information</li>
          <li>User Content</li>
          <li>Communications</li>
        </ul>

        <h3 className="mt-2 text-xl font-semibold">Information We Collect Automatically:</h3>
        <ul className="list-disc ml-5">
          <li>Usage Information</li>
          <li>Device Information</li>
        </ul>

        <h2 className="mt-4 text-2xl font-bold">2. How We Use Your Information</h2>
        <p className="mt-2">
          We may use the information we collect for various purposes, including to:
        </p>
        <ul className="list-disc ml-5">
          <li>Provide, maintain, and improve the Service</li>
          <li>Communicate with you about the Service</li>
          <li>Personalize your experience on the Service</li>
          <li>Respond to your inquiries and provide customer support</li>
          <li>
            Monitor and analyze trends, usage, and activities in connection with
            the Service
          </li>
          <li>
            Detect, investigate, and prevent fraudulent transactions and other
            illegal activities
          </li>
        </ul>

        <h2 className="mt-4 text-2xl font-bold">3. How We Share Your Information</h2>
        <p className="mt-2">We may share your information in the following ways:</p>
        <ul className="list-disc ml-5">
          <li>
            With service providers, vendors, consultants, and other third
            parties who need access to such information to carry out work on our
            behalf
          </li>
          <li>
            With our business partners for marketing, advertising, or similar
            purposes
          </li>
          <li>
            In response to a request for information if we believe disclosure is
            in accordance with any applicable law, regulation, or legal process
          </li>
          <li>
            If we believe your actions are inconsistent with the spirit or
            language of our user agreements or policies, or to protect the
            rights, property, and safety of ourselves and others
          </li>
        </ul>

        <h2 className="mt-4 text-2xl font-bold">4. Your Choices</h2>
        <p className="mt-2">
          You can control how we use and share your information by adjusting
          your privacy settings on the Service or contacting us directly.
        </p>

        <h2 className="mt-4 text-2xl font-bold">5. Data Retention</h2>
        <p className="mt-2">
          We will retain your information for as long as necessary to fulfill
          the purposes outlined in this Privacy Policy unless a longer retention
          period is required or permitted by law.
        </p>

        <h2 className="mt-4 text-2xl font-bold">6. Children's Privacy</h2>
        <p className="mt-2">
          Our Service is not intended for use by children under the age of 13,
          and we do not knowingly collect personal information from children
          under 13. If you are a parent or guardian and believe we have
          collected information from your child, please contact us.
        </p>

        <h2 className="mt-4 text-2xl font-bold">7. Changes to Our Privacy Policy</h2>
        <p className="mt-2">
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page.
        </p>

        <h2 className="mt-4 text-2xl font-bold">8. Contact Us</h2>
        <p className="mt-2">
          If you have any questions about this Privacy Policy, please contact
          us:
        </p>
        <ul className="list-disc ml-5">
          <li>By email: [Your contact email]</li>
          <li>
            By visiting this page on our website: [Your website/contact page]
          </li>
        </ul>

        <p className="mt-2">Thank you for using [Your Website/App Name]!</p>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
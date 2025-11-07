import Link from "next/link";
import { Instagram } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact</h1>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg text-gray-700 mb-4">
            Velishe Model Management is a newly established model agency in the heart of Sofia, Bulgaria, driven by a team of professionals with over two decades of work experience both in front of as well as behind the camera. Our ultimate goal is to make a unique and lasting impact on the ever growing nationwide fashion market with a greater focus in Sofia.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            At Velishe, we proudly represent, manage and develop both women and men and our board is a vibrant and diverse mix of different talents. We believe in embracing and valuing the unique beauty and individuality of each one of our models.
          </p>

          <p className="text-lg text-gray-700 mb-4">
            With the experience and the knowledge that we have gathered over the years, we are dedicated to provide our models with the best opportunities and guidance to thrive in their careers. We understand the importance of nurturing and developing a talent, and we are thriving on daily bases to help our models reach their full potential.
          </p>

          <p className="text-lg text-gray-700 mb-8">
            Velishe Model Management is not just an agency; we are a community that values creativity, inclusivity, individuality and innovation. Join us as we embark on an exciting journey to shape the future of the Sofia fashion scene.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Velishe Model Management Ltd
          </h2>

          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-medium mb-1">Office Address:</p>
              <p>
                Sofia, Bulgaria
              </p>
            </div>

            <div>
              <p className="font-medium mb-1">Email:</p>
              <a
                href="mailto:models@velishemodelmanage.com"
                className="text-gray-900 hover:text-gray-600 transition-colors"
              >
                models@velishemodelmanage.com
              </a>
            </div>

            <div>
              <p className="font-medium mb-1">Instagram:</p>
              <a
                href="https://www.instagram.com/velishe.mgmt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2"
              >
                <Instagram size={20} />
                @velishe.mgmt
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <Link href="/terms" className="hover:text-gray-900 transition-colors">
            Terms & Conditions
          </Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">
            Privacy and cookies policy
          </Link>
        </div>
    </div>
  );
}


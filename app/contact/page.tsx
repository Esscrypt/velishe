import Link from "next/link";
import { Instagram } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact</h1>

      <div className="prose prose-lg max-w-none mb-12">
        <p className="text-lg text-gray-700 mb-4">
          VÈLISHE Model Management is a new–generation boutique agency based in
          Sofia, Bulgaria.
        </p>

        <p className="text-lg text-gray-700 mb-4">
          We represent, develop, and elevate talent - women and men with
          distinct presence, attitude, and authenticity.
        </p>

        <p className="text-lg text-gray-700 mb-4">
          Our vision goes beyond trends. We focus on timeless beauty,
          individuality, and a sense of narrative within every model we work
          with.
        </p>

        <p className="text-lg text-gray-700 mb-8">
          VÈLISHE is a statement - selective, bold, and quietly assured. We
          exist to shape faces, stories, and moments that leave an imprint.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Velishe Model Management Ltd
          </h2>

          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-medium mb-1">Office Address:</p>
              <p>Sofia, Bulgaria</p>
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

        <div className="space-y-6">

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Legal
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <Link
                href="/terms"
                className="hover:text-gray-900 transition-colors"
              >
                Terms & Conditions
              </Link>
              <span>|</span>
              <Link
                href="/privacy"
                className="hover:text-gray-900 transition-colors"
              >
                Privacy and cookies policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          <strong>Last Updated: {lastUpdated}</strong>
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Introduction
          </h2>
          <p className="text-gray-700 mb-4">
            Velishe Model Management ("we," "us," or "our") is committed to
            protecting your privacy and personal data. This Privacy Policy
            explains how we collect, use, process, store, and protect your
            personal information when you visit our website at
            https://velishemodelmanagement.com (the "Website") and when you use
            our services, including when you submit information through our
            "Become a Model" form.
          </p>
          <p className="text-gray-700">
            This Privacy Policy is designed to comply with the General Data
            Protection Regulation (GDPR) (EU) 2016/679, the UK GDPR, and other
            applicable data protection laws. By using our Website and services,
            you consent to the collection and use of your personal information
            as described in this Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Data Controller
          </h2>
          <p className="text-gray-700 mb-4">
            For the purposes of GDPR and other applicable data protection laws,
            Velishe Model Management is the data controller responsible for your
            personal information. Our contact details are:
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
            <p className="text-gray-700">
              <strong>Velishe Model Management Ltd</strong>
              <br />
              Sofia, Bulgaria
              <br />
              Email:{" "}
              <a
                href="mailto:models@velishemodelmanagement.com"
                className="text-gray-900 hover:text-gray-600 transition-colors"
              >
                models@velishemodelmanagement.com
              </a>
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Information We Collect
          </h2>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            3.1 Information You Provide to Us
          </h3>
          <p className="text-gray-700 mb-4">
            When you use our "Become a Model" form or contact us, we may collect
            the following categories of personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>
              <strong>Identity Information:</strong> Full name, date of birth,
              age
            </li>
            <li>
              <strong>Contact Information:</strong> Email address, telephone
              number, mailing address
            </li>
            <li>
              <strong>Physical Characteristics:</strong> Height, weight,
              measurements, hair color, eye color, photographs, and other
              physical attributes relevant to modeling
            </li>
            <li>
              <strong>Professional Information:</strong> Modeling experience,
              portfolio information, previous work, skills, and qualifications
            </li>
            <li>
              <strong>Biometric Data:</strong> Photographs and images that may be
              considered biometric data under GDPR
            </li>
            <li>
              <strong>Special Category Data:</strong> Information revealing
              racial or ethnic origin (which may be apparent from photographs),
              and other characteristics that may be considered special category
              data under GDPR
            </li>
            <li>
              <strong>Communication Data:</strong> Any correspondence, messages,
              or communications you send to us
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            3.2 Information We Collect Automatically
          </h3>
          <p className="text-gray-700 mb-4">
            When you visit our Website, we may automatically collect:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              Technical information (IP address, browser type, device information,
              operating system)
            </li>
            <li>
              Usage data (pages visited, time spent, click patterns, referral
              sources)
            </li>
            <li>
              Cookies and similar tracking technologies (see Section 16 below)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Legal Basis for Processing
          </h2>
          <p className="text-gray-700 mb-4">
            We process your personal information under the following legal bases
            as defined by GDPR:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              <strong>Consent:</strong> When you voluntarily submit information
              through our "Become a Model" form, you provide explicit consent for
              us to process your personal data for the purposes of evaluating
              your application and contacting you regarding modeling
              opportunities.
            </li>
            <li>
              <strong>Legitimate Interests:</strong> We may process your
              information for our legitimate business interests, including
              managing our business operations, improving our services, and
              maintaining the security of our Website.
            </li>
            <li>
              <strong>Contractual Necessity:</strong> If you enter into a
              contract with us, we process your information as necessary to
              perform our contractual obligations.
            </li>
            <li>
              <strong>Legal Obligations:</strong> We may process your information
              to comply with legal obligations, including tax, accounting, and
              employment law requirements.
            </li>
          </ul>
          <p className="text-gray-700">
            <strong>Special Category Data:</strong> Where we process special
            category data (such as biometric data or information revealing racial
            or ethnic origin), we do so based on your explicit consent, which you
            provide when submitting your application through our "Become a Model"
            form.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            We use the personal information we collect for the following
            purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              To evaluate and process your application submitted through the
              "Become a Model" form
            </li>
            <li>To assess your suitability for modeling opportunities</li>
            <li>
              To contact you regarding your application and potential modeling
              opportunities
            </li>
            <li>
              To maintain our database of potential and current models
            </li>
            <li>To manage our business relationships and contracts</li>
            <li>To comply with legal and regulatory obligations</li>
            <li>To protect our legal rights and interests</li>
            <li>To improve our Website and services</li>
            <li>To prevent fraud and ensure security</li>
            <li>To send you administrative information and updates</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Image Rights and Usage Rights
          </h2>
          <p className="text-gray-700 mb-4">
            By submitting photographs, images, or videos through our "Become a
            Model" form or otherwise providing us with your likeness, you grant
            Velishe Model Management the following rights:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              <strong>Portfolio Usage:</strong> We may use your photographs and
              images in our portfolio, website, social media accounts, marketing
              materials, and promotional content to showcase our talent and
              promote our agency
            </li>
            <li>
              <strong>Client Presentations:</strong> We may share your
              photographs, measurements, and professional information with
              potential clients, photographers, brands, and other industry
              professionals for the purpose of securing modeling opportunities
            </li>
            <li>
              <strong>Comp Cards and Model Cards:</strong> We may create and
              distribute comp cards, model cards, or similar promotional
              materials featuring your images and information
            </li>
            <li>
              <strong>Digital Platforms:</strong> We may display your images on
              our website, social media platforms, online portfolios, and other
              digital platforms
            </li>
            <li>
              <strong>Industry Databases:</strong> We may submit your information
              and images to industry databases, casting platforms, and talent
              directories
            </li>
            <li>
              <strong>Publicity and Marketing:</strong> We may use your name,
              image, and likeness for publicity, advertising, and marketing
              purposes related to our agency and the modeling industry
            </li>
          </ul>
          <p className="text-gray-700">
            These rights are granted on a non-exclusive, worldwide, perpetual
            basis and may continue even after termination of any contractual
            relationship, unless you request removal in writing and we agree to
            such removal.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Model Release and Consent for Image Usage
          </h2>
          <p className="text-gray-700 mb-4">
            By submitting your application and photographs, you hereby grant
            Velishe Model Management, its clients, photographers, and authorized
            third parties the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              Photograph, film, video, or otherwise record your likeness, image,
              voice, and performance
            </li>
            <li>
              Use, reproduce, distribute, publish, display, and modify your images
              and likeness in any media format, including print, digital, online,
              and social media
            </li>
            <li>
              Use your images for commercial, advertising, promotional, editorial,
              and artistic purposes
            </li>
            <li>Create derivative works based on your images</li>
            <li>
              Use your name, biographical information, and professional details in
              connection with your images
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            You waive any right to inspect or approve the finished product or the
            use to which it may be applied. You understand that your images may
            be used in contexts that you may not have specifically contemplated,
            and you consent to such use.
          </p>
          <p className="text-gray-700">
            You represent and warrant that you are of legal age to grant such
            rights, or if you are a minor, that you have obtained the necessary
            parental or guardian consent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Social Media and Digital Usage Rights
          </h2>
          <p className="text-gray-700 mb-4">
            We may use your images and information on various social media
            platforms, including but not limited to Instagram, Facebook, Twitter,
            LinkedIn, TikTok, and other current or future social media platforms.
            This includes:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>Posting your photographs on our social media accounts</li>
            <li>
              Tagging you in posts (where applicable and with your consent)
            </li>
            <li>
              Sharing your images in stories, reels, and other social media
              features
            </li>
            <li>
              Using your images in paid advertising and sponsored content on
              social media platforms
            </li>
            <li>Cross-posting your images across multiple platforms</li>
          </ul>
          <p className="text-gray-700">
            You understand that once images are posted on social media or
            digital platforms, they may be shared, reposted, or used by third
            parties beyond our control, and we shall not be liable for such
            third-party use.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            9. Third-Party Client and Photographer Agreements
          </h2>
          <p className="text-gray-700 mb-4">
            When we share your information and images with clients, photographers,
            brands, or other third parties in the modeling industry, we do so for
            the purpose of securing modeling opportunities. You understand and
            agree that:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              Third parties may use your images in accordance with their own
              agreements and terms
            </li>
            <li>
              We are not responsible for how third parties use, store, or protect
              your information once it has been shared with them
            </li>
            <li>
              Third parties may have their own privacy policies and terms of use
              that apply to your information
            </li>
            <li>
              We require third parties to use your information only for legitimate
              business purposes related to modeling opportunities
            </li>
            <li>
              You may be required to sign separate model release forms or
              agreements with clients or photographers for specific projects
            </li>
          </ul>
          <p className="text-gray-700">
            We recommend that you review any third-party agreements carefully
            before signing, and we encourage you to consult with legal counsel if
            you have concerns about any terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            10. Age Verification and Parental Consent
          </h2>
          <p className="text-gray-700 mb-4">
            If you are under the age of 18 (or the age of majority in your
            jurisdiction), you must obtain parental or guardian consent before
            submitting information through our "Become a Model" form. By
            submitting information, you represent and warrant that:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              You are of legal age to enter into agreements, or you have obtained
              the necessary parental or guardian consent
            </li>
            <li>
              If you are a minor, your parent or guardian has reviewed and agreed
              to this Privacy Policy on your behalf
            </li>
            <li>All information you provide is accurate and truthful</li>
          </ul>
          <p className="text-gray-700 mb-4">
            We reserve the right to request proof of age and parental consent for
            individuals under 18. We may refuse to process applications from
            individuals who cannot provide appropriate verification.
          </p>
          <p className="text-gray-700">
            For models under 16, we require explicit written parental consent
            before processing any personal information, including photographs.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            11. Professional Standards and Industry Requirements
          </h2>
          <p className="text-gray-700 mb-4">
            As a modeling agency, we may collect and process additional
            information necessary for professional modeling activities, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              Health and medical information relevant to modeling assignments
              (e.g., allergies, physical limitations)
            </li>
            <li>
              Work permits, visas, and travel documents for international
              assignments
            </li>
            <li>
              Tax identification numbers and financial information for payment
              processing
            </li>
            <li>Professional references and work history</li>
            <li>Social media handles and online presence information</li>
            <li>Availability and scheduling information</li>
          </ul>
          <p className="text-gray-700 mt-4">
            This information is collected and processed to facilitate modeling
            opportunities, ensure compliance with industry standards, and fulfill
            contractual obligations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            12. Intellectual Property Rights
          </h2>
          <p className="text-gray-700 mb-4">
            You retain copyright in any photographs or images that you create and
            provide to us. However, by submitting images to us, you grant us a
            non-exclusive, worldwide, royalty-free license to use, reproduce,
            distribute, and display such images for the purposes described in this
            Privacy Policy.
          </p>
          <p className="text-gray-700 mb-4">
            For photographs taken by our photographers or third-party
            photographers during modeling assignments:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              The photographer or commissioning party typically retains copyright
              in the photographs
            </li>
            <li>
              You may be granted limited usage rights as specified in individual
              contracts or agreements
            </li>
            <li>
              We may have rights to use such photographs for portfolio and
              promotional purposes as agreed with the photographer or client
            </li>
          </ul>
          <p className="text-gray-700">
            You agree not to assert any moral rights or similar rights that may
            interfere with our use of your images as described in this Privacy
            Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            13. Right to Withdraw Image Usage Consent
          </h2>
          <p className="text-gray-700 mb-4">
            While you have the right to request that we stop using your images,
            you understand that:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              We may not be able to remove images that have already been
              published, distributed, or used by third parties
            </li>
            <li>
              Images used in ongoing campaigns or projects may continue to be used
              until the completion of such campaigns or projects
            </li>
            <li>
              We may retain images for our records and for legal or business
              purposes even after you request removal
            </li>
            <li>
              Third parties who have received your images may continue to use them
              in accordance with their own agreements
            </li>
          </ul>
          <p className="text-gray-700">
            To request removal of your images from our website or promotional
            materials, please contact us in writing. We will make reasonable
            efforts to comply with your request, subject to the limitations
            described above.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            14. Data Sharing and Disclosure
          </h2>
          <p className="text-gray-700 mb-4">
            We may share your personal information with the following categories
            of recipients:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              <strong>Service Providers:</strong> Third-party service providers
              who assist us in operating our Website and business, including
              hosting providers, email service providers, and IT support services
            </li>
            <li>
              <strong>Business Partners:</strong> Clients, photographers,
              agencies, and other business partners in the modeling industry who may be
              interested in working with you (only with your explicit consent)
            </li>
            <li>
              <strong>Legal and Regulatory Authorities:</strong> When required by
              law or to protect our legal rights
            </li>
            <li>
              <strong>Professional Advisors:</strong> Lawyers, accountants, and
              other professional advisors
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger,
              acquisition, or sale of assets, your information may be transferred
              to the acquiring entity
            </li>
          </ul>
          <p className="text-gray-700">
            We do not sell your personal information to third parties. We require
            all third parties to respect the security of your personal information
            and to treat it in accordance with applicable data protection laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            15. International Data Transfers
          </h2>
          <p className="text-gray-700 mb-4">
            Your personal information may be transferred to and processed in
            countries outside the European Economic Area (EEA) or your country of
            residence. When we transfer your information internationally, we
            ensure appropriate safeguards are in place, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              Standard Contractual Clauses approved by the European Commission
            </li>
            <li>Adequacy decisions by the European Commission</li>
            <li>
              Other appropriate safeguards as required by applicable data
              protection laws
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            16. Cookies and Tracking Technologies
          </h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar tracking technologies to collect and store
            information about your use of our Website. Cookies are small text files
            placed on your device when you visit our Website.
          </p>
          <p className="text-gray-700 mb-4">
            We use the following types of cookies:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              <strong>Essential Cookies:</strong> Required for the Website to
              function properly
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how visitors
              use our Website
            </li>
            <li>
              <strong>Functional Cookies:</strong> Remember your preferences and
              settings
            </li>
          </ul>
          <p className="text-gray-700">
            You can control cookies through your browser settings. However,
            disabling certain cookies may affect the functionality of our Website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            17. Data Retention
          </h2>
          <p className="text-gray-700 mb-4">
            We retain your personal information for as long as necessary to
            fulfill the purposes outlined in this Privacy Policy, unless a longer
            retention period is required or permitted by law. Specifically:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              <strong>Application Data:</strong> We retain information submitted
              through the "Become a Model" form for up to 3 years from the date
              of submission, unless you request deletion earlier or we enter into
              a contract with you
            </li>
            <li>
              <strong>Contract Data:</strong> If you enter into a contract with us,
              we retain your information for the duration of the contract and for
              7 years thereafter for legal and accounting purposes
            </li>
            <li>
              <strong>Marketing Communications:</strong> We retain your contact
              information for marketing purposes until you opt out or request
              deletion
            </li>
          </ul>
          <p className="text-gray-700">
            When we no longer need your personal information, we will securely
            delete or anonymize it in accordance with our data retention
            policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            18. Data Security
          </h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>Encryption of data in transit and at rest</li>
            <li>Access controls and authentication procedures</li>
            <li>Regular security assessments and updates</li>
            <li>Staff training on data protection</li>
            <li>Secure data storage and backup procedures</li>
          </ul>
          <p className="text-gray-700">
            However, no method of transmission over the Internet or electronic
            storage is 100% secure. While we strive to protect your personal
            information, we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            19. Your Rights Under GDPR
          </h2>
          <p className="text-gray-700 mb-4">
            If you are located in the EEA, UK, or Switzerland, you have the
            following rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              <strong>Right of Access:</strong> You have the right to request
              access to your personal information and receive a copy of the data
              we hold about you
            </li>
            <li>
              <strong>Right to Rectification:</strong> You have the right to
              request correction of inaccurate or incomplete personal
              information
            </li>
            <li>
              <strong>Right to Erasure ("Right to be Forgotten"):</strong> You
              have the right to request deletion of your personal information in
              certain circumstances
            </li>
            <li>
              <strong>Right to Restrict Processing:</strong> You have the right to
              request that we restrict the processing of your personal information
              in certain circumstances
            </li>
            <li>
              <strong>Right to Data Portability:</strong> You have the right to
              receive your personal information in a structured, commonly used,
              and machine-readable format and to transmit that data to another
              controller
            </li>
            <li>
              <strong>Right to Object:</strong> You have the right to object to
              processing of your personal information based on legitimate
              interests or for direct marketing purposes
            </li>
            <li>
              <strong>Right to Withdraw Consent:</strong> Where we process your
              information based on consent, you have the right to withdraw your
              consent at any time
            </li>
            <li>
              <strong>Right to Lodge a Complaint:</strong> You have the right to
              lodge a complaint with a supervisory authority if you believe we
              have violated your data protection rights
            </li>
          </ul>
          <p className="text-gray-700">
            To exercise any of these rights, please contact us using the contact
            information provided in Section 2. We will respond to your request
            within one month, though this period may be extended by two additional
            months if necessary.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            20. Children's Privacy
          </h2>
          <p className="text-gray-700">
            Our Website and services are not directed to individuals under the age
            of 16. We do not knowingly collect personal information from children
            under 16 without parental consent. If you are a parent or guardian
            and believe your child has provided us with personal information,
            please contact us immediately. If we become aware that we have
            collected personal information from a child under 16 without parental
            consent, we will take steps to delete such information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            21. Your Choices
          </h2>
          <p className="text-gray-700 mb-4">
            You have the following choices regarding your personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              You can choose not to provide certain information, though this may
              limit your ability to use certain features of our Website or
              services
            </li>
            <li>
              You can opt out of marketing communications by following the
              unsubscribe instructions in our emails or by contacting us directly
            </li>
            <li>You can control cookies through your browser settings</li>
            <li>
              You can request access, correction, or deletion of your personal
              information at any time
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            22. Third-Party Links
          </h2>
          <p className="text-gray-700">
            Our Website may contain links to third-party websites. We are not
            responsible for the privacy practices or content of these third-party
            websites. We encourage you to review the privacy policies of any
            third-party websites you visit.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            23. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time to reflect changes
            in our practices, technology, legal requirements, or other factors.
            We will notify you of any material changes by posting the updated
            Privacy Policy on our Website and updating the "Last Updated" date.
            We encourage you to review this Privacy Policy periodically to stay
            informed about how we protect your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            24. Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions, concerns, or requests regarding this Privacy
            Policy or our data practices, please contact us:
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
            <p className="text-gray-700">
              <strong>Velishe Model Management Ltd</strong>
              <br />
              Sofia, Bulgaria
              <br />
              Email:{" "}
              <a
                href="mailto:models@velishemodelmanagement.com"
                className="text-gray-900 hover:text-gray-600 transition-colors"
              >
                models@velishemodelmanagement.com
              </a>
            </p>
          </div>
          <p className="text-gray-700">
            For data protection inquiries, you can also contact your local
            supervisory authority. If you are located in the EEA, you can find
            your supervisory authority at:{" "}
            <a
              href="https://edpb.europa.eu/about-edpb/board/members_en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 hover:text-gray-600 transition-colors underline"
            >
              https://edpb.europa.eu/about-edpb/board/members_en
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            25. Consent and Agreement
          </h2>
          <p className="text-gray-700 mb-4">
            By using our Website, submitting information through our "Become a
            Model" form, or otherwise providing us with your personal information,
            you acknowledge that you have read and understood this Privacy Policy
            and consent to the collection, use, processing, and disclosure of
            your personal information as described herein.
          </p>
          <p className="text-gray-700">
            If you do not agree with this Privacy Policy, please do not use our
            Website or submit any personal information to us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            26. Governing Law
          </h2>
          <p className="text-gray-700">
            This Privacy Policy is governed by and construed in accordance with
            the laws of Bulgaria and the European Union, including GDPR. Any
            disputes arising from or related to this Privacy Policy shall be
            subject to the exclusive jurisdiction of the courts of Bulgaria,
            without prejudice to your rights under GDPR to lodge a complaint with
            your local supervisory authority.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            27. Disclaimer
          </h2>
          <p className="text-gray-700 mb-4">
            While we strive to protect your personal information, we cannot
            guarantee absolute security. You acknowledge that the transmission of
            information over the Internet is inherently insecure, and we shall not
            be liable for any breach of security or unauthorized access to your
            personal information, except to the extent required by applicable law.
          </p>
          <p className="text-gray-700">
            This Privacy Policy does not create any contractual or legal rights
            beyond those provided by applicable data protection laws. Our liability
            for any breach of this Privacy Policy or applicable data protection
            laws is limited to the maximum extent permitted by law.
          </p>
        </section>
      </div>
    </div>
  );
}

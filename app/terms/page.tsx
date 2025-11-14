export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Terms and Conditions
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          <strong>Last Updated: {lastUpdated}</strong>
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 mb-4">
            Welcome to Velishe Model Management ("we," "us," "our," or "the
            Agency"). These Terms and Conditions ("Terms") govern your access to
            and use of our website located at https://velishemodelmanagement.com
            (the "Website") and all related services, features, and content
            provided by Velishe Model Management (collectively, the "Services").
          </p>
          <p className="text-gray-700 mb-4">
            By accessing or using our Website or Services, submitting
            information through our "Become a Model" form, or otherwise
            engaging with our Agency, you agree to be bound by these Terms. If
            you do not agree to these Terms, you must not access or use our
            Website or Services.
          </p>
          <p className="text-gray-700">
            These Terms constitute a legally binding agreement between you and
            Velishe Model Management. We reserve the right to modify these Terms
            at any time, and such modifications shall be effective immediately
            upon posting on the Website. Your continued use of the Website or
            Services after any such modifications constitutes your acceptance of
            the modified Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Definitions
          </h2>
          <p className="text-gray-700 mb-4">
            For the purposes of these Terms, the following definitions apply:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              <strong>"Agency"</strong> or <strong>"Velishe Model Management"</strong> refers to
              Velishe Model Management Ltd, a modeling agency operating in Sofia,
              Bulgaria.
            </li>
            <li>
              <strong>"You"</strong> or <strong>"User"</strong> refers to any individual who
              accesses or uses the Website or Services, including but not limited
              to models, potential models, clients, and visitors.
            </li>
            <li>
              <strong>"Model"</strong> refers to any individual who has entered into
              a contractual relationship with the Agency or has submitted an
              application to become a model.
            </li>
            <li>
              <strong>"Client"</strong> refers to any individual, company, or entity
              that engages the Agency's services to secure modeling talent.
            </li>
            <li>
              <strong>"Content"</strong> refers to all text, graphics, images,
              photographs, videos, audio, software, and other materials on the
              Website.
            </li>
            <li>
              <strong>"User Content"</strong> refers to any content, including
              photographs, images, videos, text, or other materials submitted by
              you to the Agency through the Website or otherwise.
            </li>
            <li>
              <strong>"Services"</strong> refers to all services provided by the
              Agency, including but not limited to model representation, talent
              booking, portfolio management, and related services.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Eligibility and Age Requirements
          </h2>
          <p className="text-gray-700 mb-4">
            You must be at least 16 years of age to use our Website or submit an
            application through our "Become a Model" form. If you are under the
            age of 18 (or the age of majority in your jurisdiction), you must
            obtain parental or guardian consent before:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>Submitting any information through our Website</li>
            <li>Entering into any agreement with the Agency</li>
            <li>Providing any photographs, images, or other content</li>
            <li>Consenting to the use of your image or likeness</li>
          </ul>
          <p className="text-gray-700 mb-4">
            If you are under 16 years of age, you are not permitted to use our
            Website or Services without explicit written parental or guardian
            consent. We reserve the right to request proof of age and parental
            consent at any time.
          </p>
          <p className="text-gray-700">
            By using our Website or Services, you represent and warrant that:
            (a) you meet the age requirements stated above; (b) you have the
            legal capacity to enter into these Terms; (c) if you are a minor,
            you have obtained all necessary parental or guardian consent; and
            (d) all information you provide is accurate, truthful, and complete.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Use of Website and Services
          </h2>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            4.1 Permitted Use
          </h3>
          <p className="text-gray-700 mb-4">
            You may use our Website and Services only for lawful purposes and in
            accordance with these Terms. You agree to use the Website and
            Services only for:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>Browsing model portfolios and information</li>
            <li>Submitting applications to become a model</li>
            <li>Contacting the Agency for legitimate business purposes</li>
            <li>Accessing information about our Services</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            4.2 Prohibited Activities
          </h3>
          <p className="text-gray-700 mb-4">
            You agree NOT to:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              Use the Website or Services for any illegal, fraudulent, or
              unauthorized purpose
            </li>
            <li>
              Violate any applicable laws, regulations, or third-party rights
            </li>
            <li>
              Transmit any viruses, malware, or other harmful code
            </li>
            <li>
              Attempt to gain unauthorized access to any portion of the Website
              or Services
            </li>
            <li>
              Interfere with or disrupt the operation of the Website or Services
            </li>
            <li>
              Copy, reproduce, distribute, or create derivative works from any
              Content without our express written permission
            </li>
            <li>
              Use automated systems, bots, or scrapers to access or collect data
              from the Website
            </li>
            <li>
              Impersonate any person or entity or misrepresent your affiliation
              with any person or entity
            </li>
            <li>
              Submit false, misleading, or fraudulent information
            </li>
            <li>
              Harass, abuse, or harm any individual, including models, clients,
              or Agency staff
            </li>
            <li>
              Use the Website or Services to solicit business or engage in
              commercial activities without our express written consent
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. Model Applications and Submissions
          </h2>
          <p className="text-gray-700 mb-4">
            When you submit an application through our "Become a Model" form or
            otherwise provide information to the Agency, you agree to the
            following:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              All information you provide is accurate, truthful, and complete to
              the best of your knowledge
            </li>
            <li>
              You have the legal right and authority to submit all information
              and content you provide
            </li>
            <li>
              All photographs and images you submit are of yourself or you have
              obtained all necessary rights and permissions to submit them
            </li>
            <li>
              You understand that submission of an application does not guarantee
              acceptance, representation, or any contractual relationship with
              the Agency
            </li>
            <li>
              The Agency reserves the right to reject any application for any
              reason, in its sole discretion, without explanation
            </li>
            <li>
              The Agency is under no obligation to respond to, review, or process
              any application
            </li>
            <li>
              You will not submit any content that is illegal, defamatory,
              obscene, or violates any third-party rights
            </li>
            <li>
              You understand that the Agency may retain your application
              materials even if your application is rejected
            </li>
          </ul>
          <p className="text-gray-700">
            The Agency does not guarantee that any application will be reviewed
            within any specific timeframe, and we reserve the right to modify or
            discontinue the application process at any time without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Image Rights and Intellectual Property
          </h2>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            6.1 User Content License
          </h3>
          <p className="text-gray-700 mb-4">
            By submitting any photographs, images, videos, or other content
            ("User Content") to the Agency, you hereby grant Velishe Model
            Management a perpetual, irrevocable, worldwide, non-exclusive,
            royalty-free, fully paid-up license to:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>Use, reproduce, distribute, and display your User Content</li>
            <li>
              Create derivative works based on your User Content
            </li>
            <li>
              Use your User Content for promotional, marketing, advertising, and
              commercial purposes
            </li>
            <li>
              Display your User Content on the Website, social media platforms,
              and other digital and print media
            </li>
            <li>
              Share your User Content with clients, photographers, and other
              industry professionals
            </li>
            <li>
              Use your name, likeness, image, and biographical information in
              connection with your User Content
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            This license continues even after termination of any contractual
            relationship with the Agency, unless you obtain our express written
            consent to revoke such license, which we may grant or deny in our
            sole discretion.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            6.2 Agency Content
          </h3>
          <p className="text-gray-700 mb-4">
            All Content on the Website, including but not limited to text,
            graphics, logos, images, photographs, videos, and software, is the
            property of Velishe Model Management or its licensors and is
            protected by copyright, trademark, and other intellectual property
            laws.
          </p>
          <p className="text-gray-700 mb-4">
            You may not:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              Copy, reproduce, distribute, or create derivative works from any
              Content without our express written permission
            </li>
            <li>
              Use any Content for commercial purposes without our express
              written consent
            </li>
            <li>
              Remove any copyright, trademark, or other proprietary notices from
              any Content
            </li>
            <li>
              Use any automated systems to scrape or collect Content from the
              Website
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            6.3 Model Release and Consent
          </h3>
          <p className="text-gray-700 mb-4">
            By submitting your application and User Content, you hereby grant the
            Agency, its clients, photographers, and authorized third parties
            the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              Photograph, film, video, or otherwise record your likeness, image,
              voice, and performance
            </li>
            <li>
              Use, reproduce, distribute, publish, display, and modify your
              images and likeness in any media format
            </li>
            <li>
              Use your images for commercial, advertising, promotional,
              editorial, and artistic purposes
            </li>
            <li>
              Create derivative works based on your images
            </li>
            <li>
              Use your name, biographical information, and professional details
              in connection with your images
            </li>
          </ul>
          <p className="text-gray-700">
            You waive any right to inspect or approve the finished product or
            the use to which it may be applied. You understand that your images
            may be used in contexts that you may not have specifically
            contemplated, and you consent to such use.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Model Representation and Contracts
          </h2>
          <p className="text-gray-700 mb-4">
            If the Agency accepts your application and offers to represent you as
            a model, the following terms apply:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              Any representation agreement must be in writing and signed by both
              parties
            </li>
            <li>
              The terms of any representation agreement will supersede these
              Terms to the extent of any conflict
            </li>
            <li>
              The Agency reserves the right to terminate any representation
              agreement at any time, with or without cause, subject to the terms
              of the specific agreement
            </li>
            <li>
              Models are expected to maintain professional standards, including
              but not limited to punctuality, reliability, and appropriate
              conduct
            </li>
            <li>
              The Agency may require models to sign additional agreements,
              releases, or contracts for specific projects or assignments
            </li>
            <li>
              Commission rates, payment terms, and other financial arrangements
              will be specified in individual representation agreements
            </li>
            <li>
              Models must comply with all applicable laws, regulations, and
              industry standards
            </li>
            <li>
              The Agency is not responsible for any expenses incurred by models
              unless specifically agreed upon in writing
            </li>
          </ul>
          <p className="text-gray-700">
            The Agency does not guarantee any minimum number of bookings,
            assignments, or income for any model. Actual opportunities and
            compensation depend on various factors beyond the Agency's control,
            including market demand, client preferences, and model availability.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Payment Terms and Commissions
          </h2>
          <p className="text-gray-700 mb-4">
            If you enter into a representation agreement with the Agency, the
            following payment terms apply unless otherwise specified in your
            individual agreement:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              Commission rates will be specified in your representation
              agreement
            </li>
            <li>
              The Agency will deduct its commission from payments received from
              clients before remitting payment to models
            </li>
            <li>
              Payment to models will be made within a reasonable timeframe after
              receipt of payment from clients, subject to any holdbacks or
              deductions as specified in the representation agreement
            </li>
            <li>
              Models are responsible for all taxes, fees, and expenses related to
              their income
            </li>
            <li>
              The Agency is not responsible for non-payment by clients, except as
              may be specified in individual representation agreements
            </li>
            <li>
              All payment disputes must be raised in writing within 30 days of
              the payment date
            </li>
            <li>
              The Agency reserves the right to offset any amounts owed by models
              against future payments
            </li>
          </ul>
          <p className="text-gray-700">
            If you are a client engaging the Agency's services, payment terms
            will be specified in individual service agreements or contracts.
            Clients are responsible for timely payment of all fees and expenses
            as agreed upon.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            9. Disclaimers and Limitations of Liability
          </h2>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            9.1 Website and Services Disclaimer
          </h3>
          <p className="text-gray-700 mb-4">
            THE WEBSITE AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE"
            WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
            BUT NOT LIMITED TO:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
              NON-INFRINGEMENT
            </li>
            <li>
              WARRANTIES THAT THE WEBSITE OR SERVICES WILL BE UNINTERRUPTED,
              ERROR-FREE, OR SECURE
            </li>
            <li>
              WARRANTIES THAT THE WEBSITE OR SERVICES WILL MEET YOUR REQUIREMENTS
              OR EXPECTATIONS
            </li>
            <li>
              WARRANTIES REGARDING THE ACCURACY, RELIABILITY, OR COMPLETENESS OF
              ANY CONTENT ON THE WEBSITE
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            9.2 Limitation of Liability
          </h3>
          <p className="text-gray-700 mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, VELISHE MODEL
            MANAGEMENT AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND
            AFFILIATES SHALL NOT BE LIABLE FOR:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
              DAMAGES
            </li>
            <li>
              LOSS OF PROFITS, REVENUE, DATA, OR USE
            </li>
            <li>
              PERSONAL INJURY OR PROPERTY DAMAGE
            </li>
            <li>
              ANY DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE
              WEBSITE OR SERVICES
            </li>
            <li>
              ANY DAMAGES ARISING FROM UNAUTHORIZED ACCESS TO OR USE OF YOUR
              INFORMATION OR CONTENT
            </li>
            <li>
              ANY DAMAGES ARISING FROM THIRD-PARTY CONDUCT, INCLUDING BUT NOT
              LIMITED TO CLIENTS, PHOTOGRAPHERS, OR OTHER INDUSTRY PROFESSIONALS
            </li>
            <li>
              ANY DAMAGES ARISING FROM TERMINATION OF REPRESENTATION OR
              CONTRACTUAL RELATIONSHIPS
            </li>
          </ul>
          <p className="text-gray-700 mb-4">
            IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED
            THE AMOUNT YOU PAID TO US (IF ANY) IN THE TWELVE (12) MONTHS
            PRECEDING THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS
            GREATER.
          </p>
          <p className="text-gray-700">
            Some jurisdictions do not allow the exclusion or limitation of
            certain warranties or damages, so some of the above limitations may
            not apply to you. In such cases, our liability will be limited to
            the maximum extent permitted by law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            10. Indemnification
          </h2>
          <p className="text-gray-700 mb-4">
            You agree to indemnify, defend, and hold harmless Velishe Model
            Management and its officers, directors, employees, agents, and
            affiliates from and against any and all claims, damages, losses,
            liabilities, costs, and expenses (including reasonable attorneys'
            fees) arising out of or relating to:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              Your use of the Website or Services
            </li>
            <li>
              Your violation of these Terms or any applicable laws or
              regulations
            </li>
            <li>
              Your violation of any third-party rights, including but not limited
              to intellectual property rights, privacy rights, or publicity
              rights
            </li>
            <li>
              Any User Content you submit or provide
            </li>
            <li>
              Your breach of any representation or warranty made in these Terms
            </li>
            <li>
              Any claims by third parties arising from your conduct or content
            </li>
            <li>
              Any disputes between you and clients, photographers, or other third
              parties
            </li>
          </ul>
          <p className="text-gray-700">
            This indemnification obligation will survive termination of these
            Terms and your use of the Website or Services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            11. Third-Party Links and Services
          </h2>
          <p className="text-gray-700 mb-4">
            The Website may contain links to third-party websites, services, or
            resources. The Agency does not endorse, control, or assume
            responsibility for any third-party content, websites, services, or
            resources. You acknowledge and agree that:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              The Agency is not responsible for the availability, accuracy, or
              content of any third-party websites or services
            </li>
            <li>
              The Agency is not liable for any damages or losses arising from
              your use of or reliance on any third-party websites or services
            </li>
            <li>
              Your interactions with third parties, including clients,
              photographers, and other industry professionals, are solely between
              you and such third parties
            </li>
            <li>
              The Agency is not responsible for any agreements, contracts, or
              arrangements you enter into with third parties
            </li>
            <li>
              You should review the terms and conditions and privacy policies of
              any third-party websites or services you access
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            12. Termination
          </h2>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            12.1 Termination by You
          </h3>
          <p className="text-gray-700 mb-4">
            You may stop using the Website or Services at any time. If you have
            entered into a representation agreement with the Agency, termination
            will be governed by the terms of that agreement.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            12.2 Termination by the Agency
          </h3>
          <p className="text-gray-700 mb-4">
            The Agency reserves the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              Suspend or terminate your access to the Website or Services at any
              time, with or without cause or notice
            </li>
            <li>
              Reject or terminate any model representation agreement at any time,
              subject to the terms of the specific agreement
            </li>
            <li>
              Remove or delete any User Content at any time, with or without
              notice
            </li>
            <li>
              Modify or discontinue the Website or Services at any time
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            12.3 Effect of Termination
          </h3>
          <p className="text-gray-700 mb-4">
            Upon termination:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              Your right to access and use the Website or Services will
              immediately cease
            </li>
            <li>
              The Agency may retain your User Content and information as
              permitted by law and our Privacy Policy
            </li>
            <li>
              All licenses granted to the Agency regarding your User Content will
              continue in accordance with these Terms
            </li>
            <li>
              Provisions of these Terms that by their nature should survive
              termination will survive, including but not limited to Sections 6
              (Image Rights), 9 (Disclaimers), 10 (Indemnification), and 15
              (Governing Law)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            13. Force Majeure
          </h2>
          <p className="text-gray-700 mb-4">
            The Agency shall not be liable for any failure or delay in
            performance under these Terms due to circumstances beyond its
            reasonable control, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>Natural disasters, acts of God, or extreme weather conditions</li>
            <li>War, terrorism, civil unrest, or acts of terrorism</li>
            <li>Pandemics, epidemics, or public health emergencies</li>
            <li>Government actions, regulations, or restrictions</li>
            <li>Labor strikes, lockouts, or other labor disputes</li>
            <li>Internet or telecommunications failures</li>
            <li>Cyberattacks, data breaches, or security incidents</li>
            <li>Any other event or circumstance that is beyond the Agency's reasonable control</li>
          </ul>
          <p className="text-gray-700">
            In the event of such circumstances, the Agency will use reasonable
            efforts to mitigate the effects and resume normal operations as soon
            as practicable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            14. Professional Standards and Conduct
          </h2>
          <p className="text-gray-700 mb-4">
            All users, including models, clients, and visitors, are expected to
            maintain professional standards of conduct. The Agency reserves the
            right to:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              Refuse service to any individual who engages in unprofessional,
              inappropriate, or illegal conduct
            </li>
            <li>
              Terminate relationships with individuals who violate these Terms or
              engage in conduct detrimental to the Agency's reputation
            </li>
            <li>
              Take legal action against individuals who engage in harassment,
              discrimination, or other unlawful conduct
            </li>
            <li>
              Report illegal conduct to appropriate law enforcement authorities
            </li>
          </ul>
          <p className="text-gray-700">
            The Agency is committed to maintaining a safe, professional, and
            respectful environment for all individuals. Harassment,
            discrimination, abuse, or any form of inappropriate conduct will not
            be tolerated.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            15. Governing Law and Dispute Resolution
          </h2>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            15.1 Governing Law
          </h3>
          <p className="text-gray-700 mb-4">
            These Terms shall be governed by and construed in accordance with the
            laws of Bulgaria, without regard to its conflict of law provisions.
            The United Nations Convention on Contracts for the International
            Sale of Goods shall not apply.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            15.2 Dispute Resolution
          </h3>
          <p className="text-gray-700 mb-4">
            Any disputes arising out of or relating to these Terms, the Website,
            or the Services shall be resolved as follows:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              <strong>Informal Resolution:</strong> The parties agree to first
              attempt to resolve any dispute through good faith negotiation.
            </li>
            <li>
              <strong>Mediation:</strong> If informal resolution is unsuccessful,
              the parties agree to attempt mediation through a mutually agreed
              mediator before pursuing litigation.
            </li>
            <li>
              <strong>Jurisdiction:</strong> Any legal action or proceeding
              arising out of or relating to these Terms shall be brought
              exclusively in the courts of Sofia, Bulgaria. You consent to the
              personal jurisdiction of such courts and waive any objection to
              venue.
            </li>
          </ul>
          <p className="text-gray-700">
            Notwithstanding the foregoing, the Agency may seek injunctive relief
            or other equitable remedies in any court of competent jurisdiction to
            protect its intellectual property rights or prevent irreparable harm.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            16. Severability
          </h2>
          <p className="text-gray-700">
            If any provision of these Terms is found to be invalid, illegal, or
            unenforceable by a court of competent jurisdiction, such provision
            shall be modified to the minimum extent necessary to make it valid,
            legal, and enforceable, or if such modification is not possible, such
            provision shall be severed from these Terms. The remaining provisions
            shall remain in full force and effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            17. Waiver
          </h2>
          <p className="text-gray-700">
            No waiver by the Agency of any term or condition of these Terms shall
            be deemed a further or continuing waiver of such term or condition
            or a waiver of any other term or condition. Any failure by the Agency
            to assert a right or provision under these Terms shall not constitute
            a waiver of such right or provision.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            18. Entire Agreement
          </h2>
          <p className="text-gray-700 mb-4">
            These Terms, together with our Privacy Policy and any representation
            agreements or other written agreements you may enter into with the
            Agency, constitute the entire agreement between you and Velishe Model
            Management regarding the Website and Services, and supersede all
            prior or contemporaneous communications, proposals, and agreements,
            whether oral or written, relating to the subject matter hereof.
          </p>
          <p className="text-gray-700">
            If you enter into a representation agreement or other written
            agreement with the Agency, the terms of such agreement will supersede
            these Terms to the extent of any conflict, but these Terms will
            continue to apply to your use of the Website and Services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            19. Assignment
          </h2>
          <p className="text-gray-700 mb-4">
            You may not assign or transfer these Terms or any rights or
            obligations hereunder without the Agency's prior written consent. The
            Agency may assign or transfer these Terms or any rights or
            obligations hereunder without your consent:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>In connection with a merger, acquisition, or sale of assets</li>
            <li>To an affiliate or subsidiary</li>
            <li>To a successor entity</li>
          </ul>
          <p className="text-gray-700">
            Any attempted assignment or transfer in violation of this section
            shall be null and void.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            20. Notices
          </h2>
          <p className="text-gray-700 mb-4">
            All notices, requests, and other communications under these Terms
            must be in writing and delivered to:
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
            Notices may be delivered by email, registered mail, or other methods
            as specified in individual agreements. Notices will be deemed received
            when delivered or, if sent by email, when the email is sent (unless
            the sender receives a delivery failure notification).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            21. Changes to Terms
          </h2>
          <p className="text-gray-700 mb-4">
            The Agency reserves the right to modify these Terms at any time. We
            will notify you of any material changes by:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>Posting the updated Terms on the Website</li>
            <li>Updating the "Last Updated" date at the top of these Terms</li>
            <li>Providing notice via email (if you have provided an email address)</li>
          </ul>
          <p className="text-gray-700">
            Your continued use of the Website or Services after any such
            modifications constitutes your acceptance of the modified Terms. If
            you do not agree to the modified Terms, you must stop using the
            Website and Services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            22. Contact Information
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions, concerns, or requests regarding these
            Terms, please contact us:
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
            23. Acknowledgment
          </h2>
          <p className="text-gray-700 mb-4">
            BY ACCESSING OR USING THE WEBSITE OR SERVICES, SUBMITTING AN
            APPLICATION, OR OTHERWISE ENGAGING WITH THE AGENCY, YOU ACKNOWLEDGE
            THAT:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>
              You have read and understood these Terms in their entirety
            </li>
            <li>
              You agree to be bound by these Terms and all applicable laws and
              regulations
            </li>
            <li>
              You have the legal capacity and authority to enter into these Terms
            </li>
            <li>
              If you are a minor, you have obtained all necessary parental or
              guardian consent
            </li>
            <li>
              You understand the rights and obligations set forth in these Terms
            </li>
            <li>
              You consent to the use of your information and content as described
              in these Terms and our Privacy Policy
            </li>
          </ul>
          <p className="text-gray-700">
            If you do not agree to these Terms, you must not access or use the
            Website or Services.
          </p>
        </section>
      </div>
    </div>
  );
}


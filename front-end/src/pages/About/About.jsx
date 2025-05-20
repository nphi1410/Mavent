import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const About = () => {
  return (
    <>
      <Navbar />
      
      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-blue-600 text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">About Mavent</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Learn about our mission, our team, and why we're passionate about building amazing software.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  Mavent was founded in 2023 with a simple but powerful idea: to create a platform that makes building 
                  modern web applications easier, faster, and more accessible.
                </p>
                <p className="text-gray-700 mb-4">
                  We believe that technology should empower people, not complicate their lives. That's why we're dedicated 
                  to creating tools and solutions that simplify complex processes and allow developers to focus on what 
                  matters most - creating amazing user experiences.
                </p>
                <p className="text-gray-700">
                  Today, Mavent is used by thousands of developers worldwide, from solo entrepreneurs to large enterprises,
                  all united by the desire to build better software more efficiently.
                </p>
              </div>
              <div className="order-first md:order-last">
                <img 
                  src="/about-image.svg" 
                  alt="Team Collaboration" 
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2 text-blue-600">Innovation</h3>
                <p className="text-gray-600">
                  We constantly push the boundaries of what's possible, embracing new technologies and approaches to 
                  solve complex problems.
                </p>
              </div>

              {/* Value 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2 text-blue-600">Quality</h3>
                <p className="text-gray-600">
                  We believe in doing things right the first time. Quality is never an accident; it's always the result 
                  of intelligent effort.
                </p>
              </div>

              {/* Value 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2 text-blue-600">Collaboration</h3>
                <p className="text-gray-600">
                  Great things are never done in isolation. We believe in the power of teamwork and open communication.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img 
                    src="/team-member-1.jpg" 
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Jane Doe</h3>
                <p className="text-blue-600">CEO & Founder</p>
              </div>

              {/* Team Member 2 */}
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img 
                    src="/team-member-2.jpg" 
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">John Smith</h3>
                <p className="text-blue-600">CTO</p>
              </div>

              {/* Team Member 3 */}
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img 
                    src="/team-member-3.jpg" 
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Emily Johnson</h3>
                <p className="text-blue-600">Lead Developer</p>
              </div>

              {/* Team Member 4 */}
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img 
                    src="/team-member-4.jpg" 
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Michael Brown</h3>
                <p className="text-blue-600">UX Designer</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default About;

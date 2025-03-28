
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-prose text-center">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">
              <span className="gradient-text">About Autheo</span>
            </h1>
            <p className="text-muted-foreground">
              Building the decentralized future of social connectivity
            </p>
          </div>
          
          <div className="prose prose-lg prose-invert max-w-none text-center">
            <p className="lead text-center">
              Autheo is at the forefront of Web3 innovation, creating decentralized infrastructure for the next generation of social media platforms.
            </p>
            
            <h2 className="text-center">Our Mission</h2>
            <p className="text-center">
              We believe that social connectivity shouldn't be controlled by centralized entities. Our mission is to empower users by giving them full ownership of their data, content, and social connections through blockchain technology.
            </p>
            
            <h2 className="text-center">The Problem We're Solving</h2>
            <p className="text-center">
              Traditional social platforms have created walled gardens where users have little control over their data and are subject to arbitrary content moderation. Web3 ecosystems are fragmented, making it difficult for users to navigate between different platforms and communities.
            </p>
            
            <h2 className="text-center">Our Solution</h2>
            <p className="text-center">
              Autheo Connect aggregates content from multiple sources into a unified, user-friendly interface, while maintaining the decentralized nature of Web3. We're building infrastructure that respects user sovereignty while providing a seamless experience.
            </p>
            
            <h2 className="text-center">Key Principles</h2>
            <ul className="text-center list-inside">
              <li>User ownership of data and content</li>
              <li>Censorship resistance and freedom of expression</li>
              <li>Community governance and collaborative decision-making</li>
              <li>Interoperability between different platforms and protocols</li>
              <li>Privacy-preserving by design</li>
            </ul>
            
            <h2 className="text-center">Our Team</h2>
            <p className="text-center">
              Autheo was founded by a team of blockchain engineers, Web3 enthusiasts, and social media experts who believe in the transformative potential of decentralized technology. Our diverse team brings together expertise from various industries to build a truly revolutionary product.
            </p>
            
            <div className="flex justify-center my-8">
              <Button asChild className="web3-button">
                <a href="https://autheo.com/team" target="_blank" rel="noopener noreferrer">
                  Meet Our Team <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            
            <h2 className="text-center">Join the Revolution</h2>
            <p className="text-center">
              We're building a community of forward-thinking individuals who believe in the power of decentralized social media. Join us in reshaping the future of how we connect, share, and interact in the digital world.
            </p>
            
            <div className="bg-web3-dark-indigo/30 p-6 rounded-xl border border-web3-deep-purple/30 my-8 text-center">
              <h3 className="text-xl font-semibold mb-4 text-center">Get Involved</h3>
              <p className="mb-4 text-center">
                There are many ways to contribute to the Autheo ecosystem:
              </p>
              <ul className="text-center list-inside">
                <li>Join our Discord community</li>
                <li>Follow us on Twitter for the latest updates</li>
                <li>Contribute to our open-source repositories</li>
                <li>Participate in community governance</li>
                <li>Help us spread the word about decentralized social media</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;


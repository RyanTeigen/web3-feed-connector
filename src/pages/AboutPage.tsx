
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            <span className="gradient-text">About Autheo</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Building the decentralized future of social connectivity
          </p>
          <Separator className="max-w-md mx-auto mt-8 bg-accent/50" />
        </div>
        
        {/* Main Content */}
        <div className="space-y-16 max-w-4xl mx-auto">
          {/* Vision Section */}
          <section>
            <p className="text-xl md:text-2xl font-light text-center mb-12">
              Autheo is at the forefront of Web3 innovation, creating decentralized infrastructure 
              for the next generation of social media platforms.
            </p>
          </section>

          {/* Mission Section */}
          <section className="grid md:grid-cols-2 gap-12">
            <Card className="web3-card">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  We believe that social connectivity shouldn't be controlled by centralized entities. 
                  Our mission is to empower users by giving them full ownership of their data, content, 
                  and social connections through blockchain technology.
                </p>
              </CardContent>
            </Card>
            
            <Card className="web3-card">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">The Challenge</h2>
                <p className="text-muted-foreground">
                  Traditional social platforms have created walled gardens where users have little 
                  control over their data. Meanwhile, Web3 ecosystems remain fragmented, making it 
                  difficult for users to navigate between different platforms and communities.
                </p>
              </CardContent>
            </Card>
          </section>
          
          {/* Solution Section */}
          <section>
            <Card className="web3-card">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4 text-center">Our Solution</h2>
                <p className="text-muted-foreground text-center mb-6">
                  Autheo Connect aggregates content from multiple sources into a unified, 
                  user-friendly interface, while maintaining the decentralized nature of Web3. 
                  We're building infrastructure that respects user sovereignty while providing 
                  a seamless experience.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Key Principles Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-center">Key Principles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                "User ownership of data and content",
                "Censorship resistance and freedom of expression",
                "Community governance and collaborative decision-making",
                "Interoperability between different platforms and protocols",
                "Privacy-preserving by design"
              ].map((principle, i) => (
                <div key={i} className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <p className="text-center">{principle}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Team Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-center">Our Team</h2>
            <Card className="web3-card">
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  Autheo was founded by a team of blockchain engineers, Web3 enthusiasts, 
                  and social media experts who believe in the transformative potential of decentralized technology. 
                  Our diverse team brings together expertise from various industries to build a truly revolutionary product.
                </p>
                
                <div className="flex justify-center mt-6">
                  <Button asChild className="web3-button">
                    <a href="https://autheo.com/team" target="_blank" rel="noopener noreferrer">
                      Meet Our Team <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Call to Action Section */}
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Join the Revolution</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're building a community of forward-thinking individuals who believe in the power of 
              decentralized social media. Join us in reshaping the future of how we connect, share, 
              and interact in the digital world.
            </p>
            
            <Card className="bg-web3-dark-indigo/30 border border-web3-deep-purple/30 max-w-3xl mx-auto">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4 text-center">Get Involved</h3>
                <p className="mb-6 text-center">
                  There are many ways to contribute to the Autheo ecosystem:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm max-w-md mx-auto">
                  <div className="bg-background/40 backdrop-blur-sm p-2 rounded-md">
                    Join our Discord community
                  </div>
                  <div className="bg-background/40 backdrop-blur-sm p-2 rounded-md">
                    Follow us on Twitter
                  </div>
                  <div className="bg-background/40 backdrop-blur-sm p-2 rounded-md">
                    Contribute to our open-source repositories
                  </div>
                  <div className="bg-background/40 backdrop-blur-sm p-2 rounded-md">
                    Participate in community governance
                  </div>
                  <div className="bg-background/40 backdrop-blur-sm p-2 rounded-md sm:col-span-2">
                    Help us spread the word about decentralized social media
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

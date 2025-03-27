
import { Card } from "@/components/ui/card";
import { ExternalLink, Github, Globe, MessageSquare, Twitter, Youtube } from "lucide-react";

const quickLinks = [
  {
    title: "Official Website",
    description: "Explore Autheo's decentralized social platform and learn about our mission",
    icon: Globe,
    url: "https://autheo.com",
    color: "text-web3-vibrant-teal",
    bgColor: "bg-web3-vibrant-teal/10",
  },
  {
    title: "Twitter",
    description: "Follow us for the latest updates, announcements, and community engagement",
    icon: Twitter,
    url: "https://twitter.com/AutheoProject",
    color: "text-web3-electric-blue",
    bgColor: "bg-web3-electric-blue/10",
  },
  {
    title: "Discord",
    description: "Join our community to connect with other users and the core team",
    icon: MessageSquare,
    url: "https://discord.gg/autheo",
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
  },
  {
    title: "YouTube",
    description: "Watch tutorials, explainers, and development updates",
    icon: Youtube,
    url: "https://youtube.com/autheo",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    title: "GitHub",
    description: "Explore our open-source code and contribute to the project",
    icon: Github,
    url: "https://github.com/autheo",
    color: "text-gray-300",
    bgColor: "bg-gray-300/10",
  },
  {
    title: "Documentation",
    description: "Access comprehensive guides and API documentation",
    icon: Globe,
    url: "https://docs.autheo.com",
    color: "text-web3-deep-purple",
    bgColor: "bg-web3-deep-purple/10",
  },
];

const QuickLinks = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-web3-dark-indigo/30">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            <span className="gradient-text">Connect with Autheo</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
            Stay updated with Autheo across all platforms. Follow us to be part of our growing ecosystem
            and keep up with the latest developments in decentralized social media.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link) => (
            <a 
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="web3-card h-full hover:translate-y-[-5px] hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-xl ${link.bgColor} mr-4`}>
                      <link.icon className={`h-6 w-6 ${link.color}`} />
                    </div>
                    <h3 className="font-semibold text-xl group-hover:text-web3-electric-blue transition-colors">
                      {link.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground flex-grow">{link.description}</p>
                  <div className="flex items-center mt-4 text-web3-electric-blue opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Visit</span>
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;

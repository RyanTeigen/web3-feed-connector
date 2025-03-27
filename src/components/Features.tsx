
import { Activity, Database, Lock, Share2, Zap, Layers } from "lucide-react";

const features = [
  {
    name: "Decentralized Infrastructure",
    description: "Built on blockchain technology ensuring content remains censorship-resistant and user-owned",
    icon: Database,
    color: "text-web3-deep-purple",
    bgColor: "bg-web3-deep-purple/10",
  },
  {
    name: "Feed Aggregation",
    description: "Connect all your social platforms in one place for seamless content discovery",
    icon: Layers,
    color: "text-web3-electric-blue",
    bgColor: "bg-web3-electric-blue/10",
  },
  {
    name: "User Sovereignty",
    description: "You own your data and content with full control over your digital identity",
    icon: Lock,
    color: "text-web3-vibrant-teal",
    bgColor: "bg-web3-vibrant-teal/10",
  },
  {
    name: "Real-time Updates",
    description: "Stay connected with instant updates from Autheo across all platforms",
    icon: Activity,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
  },
  {
    name: "Community Focused",
    description: "Built for and with the community, emphasizing collaborative governance",
    icon: Share2,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
  {
    name: "High Performance",
    description: "Lightning-fast interface with optimized loading times for a smooth experience",
    icon: Zap,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
  },
];

const Features = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            <span className="gradient-text">Why Choose Autheo Connect?</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Our platform combines the best of Web3 technology with user-friendly design to deliver
            a revolutionary social media experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col items-start">
              <div className={`p-3 rounded-xl ${feature.bgColor}`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{feature.name}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;

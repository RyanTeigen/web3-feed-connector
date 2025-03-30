
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden py-16 sm:py-24">
      {/* Background decorative elements */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-web3-deep-purple/10 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-web3-electric-blue/10 blur-3xl"></div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="gradient-text">Decentralized Content.</span>
            <br />
            <span className="text-foreground">One Unified Experience.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Autheo Connect aggregates social feeds and Web3 content in one place, 
            providing a seamless experience for following updates across the decentralized web.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild className="web3-button bg-sky-500 hover:bg-sky-600 text-white">
              <Link to="/feeds">
                Explore Feeds <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="border-web3-deep-purple/50 hover:bg-web3-deep-purple/10">
              <Link to="/about">
                Learn About Autheo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

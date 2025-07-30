"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MessageCircle,
  Instagram,
  Bot,
  ShoppingCart,
  RefreshCw,
} from "lucide-react";
import { Terminal } from "./terminal";
import Agent from "@/app/api/agent";
import Image from "next/image";
import { useState, useEffect } from "react";

// Images from public folder
const publicImages = [
  { src: "/huncywhatsapp.png", alt: "Huncy WhatsApp" },
  { src: "/huncyinstagram.png", alt: "Huncy Instagram" },
];

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % publicImages.length
      );
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl md:text-5xl">
                Agentic Customer Service
                <span className="block text-indigo-500">
                  for WhatsApp & Instagram
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Automate your customer support with intelligent AI agents that
                handle order queries, refund requests, and more across WhatsApp
                and Instagram messaging platforms.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <a href="https://www.linkedin.com/in/joel-t-110941240/">
                  <Button
                    size="lg"
                    className="text-lg rounded-full bg-indigo-500 hover:bg-orange-600"
                  >
                    Contact Us
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              {/* <Terminal /> */}
              <Agent />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Powerful AI Features for Your Business
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Deploy intelligent customer service across your messaging channels
            </p>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-8 mb-16">
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mb-4">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                WhatsApp Integration
              </h3>
              <p className="text-base text-gray-500">
                Connect your AI agent to WhatsApp Business API and handle
                customer queries 24/7 with intelligent responses and order
                tracking capabilities.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 mt-8 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-pink-500 text-white mb-4">
                <Instagram className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                Instagram Messaging
              </h3>
              <p className="text-base text-gray-500">
                Integrate with Instagram Direct Messages to provide seamless
                customer support and handle inquiries across all your social
                media channels.
              </p>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Order Query Management
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  AI agents automatically handle "Where is my order?" queries,
                  providing real-time shipping status, delivery estimates, and
                  tracking information.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Smart Refund Processing
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Accept images and metadata for refund requests. AI validates
                  submissions and notifies business owners for approval with all
                  necessary details.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <Bot className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Intelligent AI Agent
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Advanced natural language processing understands customer
                  intent and provides contextually appropriate responses with
                  human-like interaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="py-16 bg-gray-50">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Ready to automate your customer service?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Join hundreds of businesses already using our AI agents to
                provide exceptional customer support on WhatsApp and Instagram.
                Reduce response times and increase customer satisfaction.
              </p>
              <div className="mt-6">
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-indigo-500 rounded-full mr-3"></span>
                    24/7 automated customer support
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-indigo-500 rounded-full mr-3"></span>
                    Real-time order tracking integration
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-indigo-500 rounded-full mr-3"></span>
                    Intelligent refund request processing
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-indigo-500 rounded-full mr-3"></span>
                    Multi-platform messaging support
                  </li>
                </ul>
              </div>
              {/* <div className="mt-8 flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                <a href="/sign-up">
                  <Button
                    size="lg"
                    className="text-lg rounded-full bg-indigo-500 hover:bg-orange-600 w-full lg:w-auto"
                  >
                    Get Started Free
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </a>
                <a href="/demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg rounded-full w-full lg:w-auto"
                  >
                    Watch Demo
                  </Button>
                </a>
              </div> */}
            </div>
          </div>
          <div className="py-16 bg-white">
            {/* Image Carousel - will stack below on mobile, side by side on lg+ */}
            <div className="mt-12 lg:mt-0 flex justify-center">
              <div className="relative bg-white">
                <div className="w-80 h-96 flex items-center justify-center">
                  <Image
                    src={publicImages[currentImageIndex].src}
                    alt={publicImages[currentImageIndex].alt}
                    width={320}
                    height={640}
                    className="object-contain duration-500"
                  />
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center mt-4 space-x-2">
                  {publicImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? "bg-gray-400"
                          : "bg-gray-300"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { CloudArrowUpIcon, ShareIcon, CalendarDaysIcon, UserIcon } from "@heroicons/react/24/outline";

const features = [
  {
    name: "Unlimited storage",
    description:
      "You do not have to pay for storage. We offer unlimited storage for all users. You can store as many workouts as you want, and we will never delete them.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Coach",
    description:
      "You can give your coach access to your workouts. They can view your workouts, and give you feedback. You can also give them access to your workout planner.",
    icon: UserIcon,
  },
  {
    name: "Workout planner",
    description:
      "We offer a free to use, simple workout planner where you can plan your workouts. Makes it easy to plan the right amount of volume, and time spent in intensity zones.",
    icon: CalendarDaysIcon,
  },
  {
    name: "Share with friends and family",
    description:
      "You can share your workouts with friends and family. They can view your workouts, and you can view theirs. You can also comment on each others workouts, and give each other feedback",
    icon: ShareIcon,
  },
];

const HomePage = () => {
  return (
    <div className="theme-bg min-h-screen flex flex-col justify-between px-6 pt-14 lg:px-8 w-full">
      <Navigation />
      
      <main className="flex-1">
        <div className="mx-auto max-w-2xl py-10 sm:py-48 lg:py-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Simplify Your Planning
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We offer a free to use, simple workout planner where you can plan your workouts. Makes it easy to plan the right amount of volume, and time spent in intensity zones.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {/* Oppdaterte farger: Blå for "Get started"-knappen og oransje for "Learn more"-linken */}
              <a
                href="#"
                className="rounded-md bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                Get started
              </a>
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-orange-500"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div id="features" className="bg-white sm:py-6">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
              <div className="mx-auto max-w-2xl lg:text-center">
                <h3 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Features
                </h3>
              </div>
              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-16">
                      {/* Oppdaterte ikonfarger: Oransje bakgrunn for ikonene */}
                      <dt>
                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </div>
                        {feature.name}
                      </dt>
                      <dd className="mt-2 text-base leading-7 text-gray-600">
                        {feature.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;

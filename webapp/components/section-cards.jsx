import { Search, MapPin, Map } from "lucide-react";
import { Button } from "./ui/button";

export function SectionCards() {
  return (
    <div className=" px-8 py-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center">
          {/* Header Section */}
          <div className="text-left lg:w-1/3 mb-8 lg:mb-0 lg:pr-8 pt-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              CeylonNomad
            </h1>
            <p className="text-xl text-gray-700 mb-4">
              Start your Nomad Journey
            </p>
            <p className="text-gray-600 text-base mt-0 pt-0">
              Bro ipsum dolor sit amet twir tip over the bars bro. Gromit
              broseidon dust on crust like hammerhead white room gnarly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:w-2/3">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-left h-full flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Search for Jobs
              </h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow">
                We vet companies job vacancies before listing them. They are
                actively looking for you!
              </p>
              <Button
                variant="outline"
                className="w-full bg-white border border-gray-200 transition-colors duration-1000  hover:border-black text-gray-800 font-medium py-2 px-4 rounded-xl hover:bg-white"
              >
                Explore Jobs
              </Button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 text-left h-full flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Find Places to Work
              </h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow">
                We vet companies job vacancies before listing them. They are
                actively looking for you!
              </p>
              <Button
                variant="outline"
                className="w-full bg-white border border-gray-200 transition-colors duration-1000  hover:border-black text-gray-800 font-medium py-2 px-4 rounded-xl hover:bg-white"
              >
                Search Places
              </Button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 text-left h-full flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                City Guide
              </h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow">
                We vet companies job vacancies before listing them. Powered by
                Perplexity Sonar.
              </p>
              <Button
                variant="outline"
                className="w-full bg-white border border-gray-200 transition-colors duration-1000  hover:border-black text-gray-800 font-medium py-2 px-4 rounded-xl hover:bg-white"
              >
                Try Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

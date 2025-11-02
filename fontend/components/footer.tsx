import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-gray-700 bg-black text-white mt-auto">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-lg font-semibold text-white">Underrate</h3>
            <p className="text-sm text-gray-300 text-center md:text-left">
              Join the competition{" "}
              <span className="font-medium text-white">
                SEAL HACKATHON 2025
              </span>
            </p>
            <p className="text-sm text-gray-300 text-center md:text-left">
              FPT University HCM Campus{" "}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1 text-sm text-gray-300">
            <p>© 2025 Underrate Team</p>
            <p>SEAL HACKATHON 2025</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

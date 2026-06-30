"use client";

import Particles, { ParticlesProvider } from "@tsparticles/react";
import type { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const particlesInit = async (engine: Engine) => {
    // loadSlim optimizes the bundle size by only loading the core particle features we need
    await loadSlim(engine);
};

export default function NodeNetwork() {
    return (
        <ParticlesProvider init={particlesInit}>
            <Particles
            id="tsparticles"
            className="absolute inset-0 w-full h-full z-0 pointer-events-auto"
            options={{
                background: {
                    color: { value: "transparent" },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "grab", // Draws lines connecting nodes to the user's cursor
                        },
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            links: {
                                opacity: 0.8,
                                color: "#a855f7", // Tailwind purple-500 matching your theme
                            },
                        },
                    },
                },
                particles: {
                    color: {
                        value: ["#ffffff", "#a855f7", "#9333ea"], // White and Purple accents
                    },
                    links: {
                        color: "#52525b", // Zinc-600 for the idle network lines
                        distance: 150,
                        enable: true,
                        opacity: 0.3,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 1, // Slow, elegant movement
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            width: 800, // v3 uses width/height instead of area
                            height: 800
                        },
                        value: 60, // Adjust this to add more/fewer nodes
                    },
                    opacity: {
                        value: 0.6,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 4 },
                    },
                },
                detectRetina: true,
            }}
        />
        </ParticlesProvider>
    );
}
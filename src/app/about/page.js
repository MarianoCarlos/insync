import Navbar from "@/components/navbar";
import { Award, Heart, BarChart, RefreshCw, MessageSquare, HandMetal } from "lucide-react";

const About = () => {
	return (
		<div className="min-h-screen flex flex-col bg-[#F1F1F1] text-[#252525]">
			<Navbar />

			<main className="flex-1 pt-32 pb-20">
				{/* Hero Section */}
				<section className="py-12">
					<div className="container mx-auto px-4 md:px-6">
						<div className="max-w-3xl mx-auto text-center">
							<div className="inline-block px-3 py-1 mb-6 text-sm font-medium text-[#1D809A] bg-[#1D809A]/10 rounded-full">
								Our Mission
							</div>
							<h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
								Breaking Communication Barriers Through Technology
							</h1>
							<p className="text-xl text-[#8D9192]">
								We're on a mission to make communication accessible for everyone, regardless of their
								hearing abilities.
							</p>
						</div>
					</div>
				</section>

				{/* Vision Section */}
				<section className="py-12 bg-[#EDEDED]">
					<div className="container mx-auto px-4 md:px-6">
						<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
							<div className="space-y-6">
								<h2 className="text-2xl md:text-3xl font-bold tracking-tight">Our Vision</h2>
								<p className="text-[#8D9192]">
									At InSync, we envision a world where communication is effortless for everyone,
									regardless of hearing ability. Our platform is designed to break down the barriers
									between ASL and spoken language, using technology as the bridge.
								</p>
								<p className="text-[#8D9192]">
									We believe that through innovation, education, and accessibility, we can create a
									more inclusive society where every voice is heard and understood.
								</p>
							</div>
							<div>
								<div className="aspect-video rounded-2xl overflow-hidden">
									<iframe
										className="w-full h-full"
										src="https://www.youtube.com/embed/tS9oAbDSkqA"
										title="ASL Vision Video"
										frameBorder="0"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
			<footer className="text-center py-6 text-gray-600">
				<p>&copy; 2025 ASL Web App. All rights reserved.</p>
			</footer>
		</div>
	);
};

export default About;

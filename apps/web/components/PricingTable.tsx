"use client";
import { useState, useEffect } from "react";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { LessonType } from "@/lib/types";
import { apiClient } from "@/lib/api";

export default function PricingTable() {
  const [lessonTypes, setLessonTypes] = useState<LessonType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.public.services()
      .then(response => {
        setLessonTypes(response.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-barn-900 mx-auto"></div>
          <p className="mt-4 text-barn-700">Loading pricing...</p>
        </div>
      </section>
    );
  }

  const formatPrice = (priceCents: number) => {
    return `$${(priceCents / 100).toFixed(0)}`;
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-4">
          Lessons & Packages
        </h2>
        <p className="text-lg text-barn-700 max-w-2xl mx-auto">
          Choose the perfect lesson type for your skill level and goals. 
          All lessons include safety equipment and experienced instruction.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lessonTypes.map((lesson, index) => (
          <div
            key={lesson.id}
            className={`card relative ${
              index === 1 ? 'ring-2 ring-copper-600 scale-105' : ''
            }`}
          >
            {index === 1 && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-copper-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Most Popular
                </div>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-xl font-semibold text-barn-900 mb-2">
                {lesson.name}
              </h3>
              <div className="text-3xl font-bold text-barn-900 mb-1">
                {formatPrice(lesson.priceCents)}
              </div>
              <div className="text-sm text-barn-600 mb-6">
                per {lesson.durationMinutes}-minute lesson
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                <span className="text-barn-700">
                  {lesson.durationMinutes} minutes of instruction
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                <span className="text-barn-700">
                  {lesson.maxStudents === 1 ? 'Private lesson' : `Up to ${lesson.maxStudents} students`}
                </span>
              </div>
              {lesson.requiresHorse && (
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                  <span className="text-barn-700">Horse provided</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                <span className="text-barn-700">Safety equipment included</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                <span className="text-barn-700">Experienced instructor</span>
              </div>
            </div>

            <Link
              href={`/portal/student/book?lessonType=${lesson.id}`}
              className={`w-full btn text-center ${
                index === 1 ? 'btn-secondary' : 'btn-primary'
              }`}
            >
              Book Now
            </Link>
          </div>
        ))}
      </div>

      {/* Package Deals */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold text-barn-900 mb-4">
          Save with Lesson Packages
        </h3>
        <p className="text-barn-700 mb-8">
          Purchase multiple lessons at once and save money while committing to your riding journey.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="card text-center">
            <h4 className="text-lg font-semibold text-barn-900 mb-2">4-Lesson Package</h4>
            <div className="text-2xl font-bold text-barn-900 mb-2">Save 10%</div>
            <p className="text-sm text-barn-600 mb-4">Perfect for beginners getting started</p>
            <Link href="/portal/student/packages" className="btn btn-outline w-full">
              View Packages
            </Link>
          </div>
          
          <div className="card text-center">
            <h4 className="text-lg font-semibold text-barn-900 mb-2">8-Lesson Package</h4>
            <div className="text-2xl font-bold text-barn-900 mb-2">Save 15%</div>
            <p className="text-sm text-barn-600 mb-4">Great value for regular riders</p>
            <Link href="/portal/student/packages" className="btn btn-outline w-full">
              View Packages
            </Link>
          </div>
          
          <div className="card text-center">
            <h4 className="text-lg font-semibold text-barn-900 mb-2">12-Lesson Package</h4>
            <div className="text-2xl font-bold text-barn-900 mb-2">Save 20%</div>
            <p className="text-sm text-barn-600 mb-4">Best value for committed students</p>
            <Link href="/portal/student/packages" className="btn btn-outline w-full">
              View Packages
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-16 text-center">
        <div className="bg-butter-200 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-barn-900 mb-4">
            What's Included in Every Lesson
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span className="text-barn-700">Professional instruction</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span className="text-barn-700">Safety helmet and equipment</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span className="text-barn-700">Well-trained horses</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span className="text-barn-700">Progress tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span className="text-barn-700">Flexible scheduling</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span className="text-barn-700">Beautiful facility</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

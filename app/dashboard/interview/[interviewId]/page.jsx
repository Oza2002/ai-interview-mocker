"use client";
import { MockInterview } from '@/utils/schema';
import React, { useEffect, useState } from 'react';  // Combined import for React and useEffect
import { eq } from 'drizzle-orm';
import { db } from '@/utils/db';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Interview({ params }) {
    const [interviewData, setInterviewData] = useState(null); // Initialize interviewData as null
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        if (params.interviewId) {
            GetInterviewDetails();
        }
    }, [params.interviewId]);

    /**
     * Used to get Interview Details by MockId/Interview Id
     */
    const GetInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));
            
            if (result.length > 0) {
                setInterviewData(result[0]);
            } else {
                setError('No interview data found.');
            }
        } catch (err) {
            console.error('Error fetching interview data:', err);
            setError('Failed to fetch interview data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='my-10'>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <div className='flex flex-col my-5 gap-5'>
                    <div className='flex flex-col p-5 rounded-lg border'>
                        {loading ? (
                            <p>Loading interview data...</p> // Display loading message while waiting for data
                        ) : error ? (
                            <p className='text-red-500'>{error}</p> // Display error message if there is an error
                        ) : interviewData ? ( // Check if interviewData is available before rendering
                            <>
                                <h2 className='text-lg'><strong>Job Role/Job Position:</strong> {interviewData.jobPosition}</h2>
                                <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong> {interviewData.jobDesc}</h2>
                                <h2 className='text-lg'><strong>Years Of Experience:</strong> {interviewData.jobExperirnce}</h2>
                            </>
                        ) : (
                            <p>No interview data available.</p>
                        )}
                    </div>
                    <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                        <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb /><strong>Information</strong></h2>
                        <h2 className='mt-3 text-yellow-500'>Enable video Web Cam and Microphone to Start your AI Generated Mock Interview. It has some questions which you can answer, and you will get the report based on your answers. NOTE: We never record your video, webcam access can be disabled at any time if you want.</h2>
                    </div>
                </div>
                <div>
                    {webCamEnabled ? (
                        <Webcam
                            onUserMedia={() => setWebCamEnabled(true)}
                            onUserMediaError={() => setWebCamEnabled(false)}
                            mirrored={true}
                            style={{
                                height: 300,
                                width: 300
                            }}
                        />
                    ) : (
                        <>
                            <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
                            <Button variant="ghost" className="w-full" onClick={() => setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
                        </>
                    )}
                </div>
            </div>
            <div className='flex justify-end items-end my-5'>
            <Link href={'/dashboard/interview/' + params.interviewId + '/start'}>
                    <Button>Start Interview</Button>
                </Link>
            </div>
        </div>
    );
}

export default Interview;

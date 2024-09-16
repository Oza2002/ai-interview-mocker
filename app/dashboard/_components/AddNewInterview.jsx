"use client";
import React, { useState } from 'react';  // Import useState

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAIModal';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';
// Import LoaderCircle if you have one or use a different loading spinner

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobExperirnce, setJobExperirnce] = useState('');
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResonse] = useState(null);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperirnce);

    const InputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperirnce}, Depends on Job Position, Job Description & Years of Experience give us ${process.env.SOME_ENV_VARIABLE} Interview question along with Answer in JSON format. Give us question and answer field on JSON`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);

      // Get the raw text response from AI
      let aiResponse = await result.response.text();
      
      // Log the AI response for debugging
      console.log("Raw AI Response:", aiResponse);
      
      // Clean the AI response
      aiResponse = aiResponse.replace(/```json|```/g, '').trim(); // Remove ```json and ``` markers, and trim whitespace

      // Attempt to parse the JSON response
      let MockJsonResp;
      try {
        MockJsonResp = JSON.parse(aiResponse); // Parse the cleaned response into JSON
        console.log(MockJsonResp);
        setJsonResonse(MockJsonResp);
      } catch (jsonError) {
        // Log the error and the response if parsing fails
        console.error("Error parsing JSON:", jsonError);
        console.error("AI Response that caused parsing error:", aiResponse);
        alert("Failed to parse AI response. Please check the console for details.");
        return; // Exit the function if JSON parsing fails
      }

      const resp = await db.insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperirnce: jobExperirnce,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-YYYY')
        })
        .returning({ mockID: MockInterview.mockId });

      console.log("Inserted ID:", resp);
      if (resp) {
        setOpenDialog(false);
        router.push('/dashboard/interview/' + resp[0]?.mockID);
      }

    } catch (error) {
      console.error("Error fetching data from AI:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div
        className='p-10 border rounded-lg bg-secondary
        hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={() => setOpenDialog(true)}
      >
        <h2 className='font-bold text-lg text-center'>+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Tell us more about your job interviewing</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>Add Details about your job position/role, job description, and years of experience</h2>
                  <div className='mt-7 my-3'>
                    <label>Job Role/Job Position</label>
                    <Input placeholder="Ex. UI/UX Designer" required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>
                  <div className='mt-7 my-3'>
                    <label>Job Description/Tech Stack (In Short)</label>
                    <Textarea placeholder="Ex. Figma, Adobe XD" required
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>
                  <div className='my-3'>
                    <label>Years of Experience</label>
                    <Input placeholder="Ex. 5" type="number" max="50" required
                      onChange={(event) => setJobExperirnce(event.target.value)}
                    />
                  </div>
                </div>
                <div className='flex gap-5 justify-end'>
                  <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        {/* Replace LoaderCircle with your actual loading spinner component */}
                        <span className="loader-circle"></span> Generating from AI...
                      </>
                    ) : (
                      'Start Interview'
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;

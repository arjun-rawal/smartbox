"use client"
import { Button } from "@/components/ui/button";
import {db} from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
export default function Home() {
  console.log(db)
  const sendWrite = async () => {
    try {
      
      const testRef = doc(db, 'users', 'test-doc');
      await setDoc(testRef, {
        test: true,
        timestamp: new Date().toISOString()
      });
      console.log("Test write successful");
      
      const testDoc = await getDoc(testRef);
      console.log("Test read successful:", testDoc.data());
    } catch (error) {
      console.error("Test write failed:", error);
    }
  };
  return (
    <> 
      <Button onClick={sendWrite}>Test Write</Button>
    </>
  );
}

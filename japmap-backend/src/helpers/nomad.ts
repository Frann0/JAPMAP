import { PrismaClient } from "@prisma/client"
import { nomad } from "../../http-nomad";
import { Axios } from "axios";

const prisma = new PrismaClient();


const updateNomadInstancesStatus = async (id: string, status: string) => {
  const p = await prisma.nomadInstance.update({
    where: {
      id: id,
    },
    data: {
      status: status,
    },
  });
  console.log(p)
}

export const listenToNomadStream = async (broadcast: (data: any) => void) => {
  try {
    const axios = new Axios({
      baseURL: "http://localhost:4646/v1",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "X-Nomad-Token": process.env.NOMAD_TOKEN,
      },
      responseType: "stream"
    });

    let buffer = "";

    const response = await axios.get("/event/stream?topic=Job").then((response) => {
      response.data.on('data', (chunk) => {
        buffer += chunk.toString(); // Append chunk to buffer

        let boundaryIndex;
        console.log("Buffer:", buffer.indexOf("\n"));
        while ((boundaryIndex = buffer.indexOf("\n")) !== -1) {
          // Extract the complete JSON object
          const eventString = buffer.slice(0, boundaryIndex).trim();
          buffer = buffer.slice(boundaryIndex + 2); // Remove processed part from buffer

          if (eventString === "{}") {
            console.log("Empty event string");
            buffer = "";
            return;
          }

          if (eventString) {
            try {
              const jsonData = JSON.parse(eventString); // Parse the JSON
              console.log(jsonData)
              for (const event of jsonData.Events) {
                const jobId = event.Payload.Job.ID;
                const status = event.Payload.Job.Status;
                console.log(`Job ${jobId} status updated: ${status}`);
                updateNomadInstancesStatus(jobId, status);
                broadcast({ jobId, status });
              }
            } catch (err) {
              console.error("Error parsing JSON:", err, "Event String:", eventString);
            }
          }
        }
      })
      response.data.on('end', () => {
        console.warn("Stream Finished");
        buffer = "";
        setTimeout(listenToNomadStream, 5000);
      })
    })
  } catch (error) {
    console.error(error);
    setTimeout(listenToNomadStream, 5000);
  }

}



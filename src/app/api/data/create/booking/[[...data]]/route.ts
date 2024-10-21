import {NextRequest, NextResponse} from "next/server"
import {} from "firebase/firestore"



export default async function POST(req: NextRequest, data: { data: string[] }) {
//   return NextResponse.redirect("/api/data/create/booking/" + req.body.data.join("/"))



    return NextResponse.json({})

}
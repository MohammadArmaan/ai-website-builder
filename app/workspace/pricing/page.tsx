import { PricingTable } from "@clerk/nextjs";

export default function Pricing() {
    return <div className="p-5 w-full flex flex-col items-center justify-center">
        <h2 className="font-bold text-4xl my-10">Pricing</h2>
        <div className="flex w-[300px] sm:w-[500px] lg:w-[800px]">

      <PricingTable />
        </div>
    </div>
}
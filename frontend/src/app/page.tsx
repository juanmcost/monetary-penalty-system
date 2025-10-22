import Link from "next/link";
import ObjectivesList from './components/objectives-list';

export default function Home() {

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-6">Your Objectives</h1>
      <ObjectivesList />
      <div className="mt-8">
        <Link href="/create-objective" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Add New Objective
        </Link>
      </div>
    </main>
  );
}
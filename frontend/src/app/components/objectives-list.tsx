'use client';

import { useQuery } from "@tanstack/react-query";

import { getObjectives } from '@/src/api/objectives';
import { Objective } from '@/src/api/types';

export default function ObjectivesList() {
    const { data: objectives = [], isLoading, isError } = useQuery<Objective[]>({
        queryKey: ["objectives"],
        queryFn: getObjectives,
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return <p>Error loading objectives.</p>;
    }

    return (
        <ul className="space-y-4">
            {objectives.map((objective) => (
                <li key={objective.id} className="p-4 border rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold">{objective.name}</h2>
                    <p className="text-gray-600">Deadline: {objective.deadline}</p>
                </li>
            ))}
        </ul>
    );
}
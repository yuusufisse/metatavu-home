import { Person } from "src/generated/client";
import { Allocations, Projects, Tasks } from "src/generated/homeLambdasClient";

/**
 * Retrieve total time entries for an Allocation
 * 
 * @param allocation task allocated within a project
 * @param allocations tasks related to the project
 * @param timeEntries  total time entries requested for each allocation
 */
export const getTotalTimeEntriesAllocations = (allocation: Allocations, allocations: Allocations[], timeEntries: number[]) => {
  if (timeEntries.length) {
    return timeEntries[allocations.indexOf(allocation)] || 0;
  }
  return 0;
}

/**
 * Retrieve total time entries for a task
 * 
 * @param task task of allocated project
 * @param tasks total tasks related to the project
 * @param timeEntries total time entries requested for each task
 */
export const getTotalTimeEntriesTasks = (task: Tasks, tasks: Tasks[], timeEntries: number[]) => {
  if (timeEntries.length) {
    return timeEntries[tasks.indexOf(task)] || 0;
  }
  return 0;
}

/**
 * Get project name
 * 
 * @param allocation task allocated within a project
 * @param allocations tasks related to the project
 * @param projects project associated with the given allocation
 */
export const getProjectName = (allocation: Allocations, allocations: Allocations[], projects: Projects[]) => {
  if (projects.length) {
    return projects[allocations.indexOf(allocation)]?.name || "";
  }
  return "";
}

/**
 * Get project color
 * 
 * @param allocation task allocated within a project
 * @param allocations tasks related to the project
 * @param projects project associated with the given allocation
 */
export const getProjectColor = (allocation: Allocations, allocations: Allocations[], projects: Projects[]) => {
  if (projects.length) {
    return projects[allocations.indexOf(allocation)]?.color || "";
  }
  return "";
}

/**
 * Calculate total time allocated to the project for 2 week period
 * 
 * @param allocation expected work load of user in minutes
 */
export const totalAllocations = (allocation: Allocations) => {
  const totalMinutes =
    (allocation.monday || 0) + 
    (allocation.tuesday || 0) + 
    (allocation.wednesday || 0) + 
    (allocation.thursday || 0) + 
    (allocation.friday || 0);
  return totalMinutes * 2;
}

/**
 * Calculate the remaining time of project completion
 * 
 * @param allocation task allocated within a project
 * @param allocations tasks related to the project
 * @param projects project associated with the given allocation
 */
export const timeLeft = (allocation: Allocations, allocations: Allocations[], timeEntries: number[]) => {
  return totalAllocations(allocation) - getTotalTimeEntriesAllocations(allocation, allocations, timeEntries) || 0;
}

/**
 * Calculate registered time for the user in the current 2 week period
 * 
 * @param person user time spent on the project in minutes
 */
export const calculateWorkingLoad = (person?: Person) => {
  if (!person) {
    return 0;
  }
  const totalMinutes =
    (person.monday || 0) + 
    (person.tuesday || 0) + 
    (person.wednesday || 0) + 
    (person.thursday || 0) + 
    (person.friday || 0);
  return totalMinutes * 2;
}
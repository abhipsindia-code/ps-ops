import JobCard from "./JobCard";

export default function JobList({ jobs }) {
  return (
    <div>
      <h4>Jobs</h4>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

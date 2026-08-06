'use client';

import { useState } from 'react';
import { getAlumni, getAlumniFilterOptions } from '@/lib/api';
import type { Alumni, AlumniListResponse } from '@/lib/types';
import { IconSearch } from '@/components/Icons';

const ROLE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'executive', label: 'Executive' },
];

export default function AlumniDirectory({ initial }: { initial: AlumniListResponse }) {
  const [generation, setGeneration] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [roleLevel, setRoleLevel] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<AlumniListResponse>(initial);
  const [alumniList, setAlumniList] = useState<Alumni[]>(initial.data);
  const [loading, setLoading] = useState(false);

  const filterOptions = getAlumniFilterOptions(initial.data);

  async function runSearch(nextPage: number, append: boolean) {
    setLoading(true);
    try {
      const res = await getAlumni({
        generation,
        industry,
        location,
        roleLevel,
        q: query,
        page: nextPage,
        limit: initial.limit || 9,
      });
      setResult(res);
      setAlumniList((prev) => (append ? [...prev, ...res.data] : res.data));
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    runSearch(1, false);
  }

  const hasMore = alumniList.length < result.total;

  return (
    <div>
      <form
        onSubmit={handleSearch}
        className="mb-10 grid gap-4 rounded-card border border-border bg-white p-6 sm:grid-cols-2 lg:grid-cols-5"
      >
        <div className="lg:col-span-2">
          <label htmlFor="alumni-q" className="field-label">
            Search by name, company, role
          </label>
          <div className="relative">
            <IconSearch
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-body"
            />
            <input
              id="alumni-q"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="field-input pl-10"
              placeholder="e.g. Sarah Johnson"
            />
          </div>
        </div>
        <div>
          <label htmlFor="alumni-year" className="field-label">
            Generation / Year
          </label>
          <select
            id="alumni-year"
            value={generation}
            onChange={(e) => setGeneration(e.target.value)}
            className="field-input"
          >
            <option value="">All years</option>
            {filterOptions.generations.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="alumni-industry" className="field-label">
            Industry
          </label>
          <select
            id="alumni-industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="field-input"
          >
            <option value="">All industries</option>
            {filterOptions.industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="alumni-location" className="field-label">
            Location
          </label>
          <select
            id="alumni-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="field-input"
          >
            <option value="">All locations</option>
            {filterOptions.locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="alumni-role" className="field-label">
            Role Level
          </label>
          <select
            id="alumni-role"
            value={roleLevel}
            onChange={(e) => setRoleLevel(e.target.value)}
            className="field-input"
          >
            <option value="">All levels</option>
            {ROLE_LEVELS.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end lg:col-span-5">
          <button type="submit" disabled={loading} className="btn-blue">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <p className="mb-6 text-sm font-medium text-ink-body">
        {result.total.toLocaleString()} alumni found
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {alumniList.map((alum) => (
          <div key={alum.id} className="card flex gap-4 p-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-purple/15 text-lg font-bold text-accent-purple">
              {alum.fullName.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-ink-heading">{alum.fullName}</p>
              <p className="text-sm text-ink-body">
                {alum.jobTitle} at {alum.company}
              </p>
              <p className="mt-1 text-xs text-ink-body">
                Class of {alum.classYear} &middot; {alum.location}
              </p>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-body">{alum.bio}</p>
              <div className="mt-4 flex gap-3">
                <button type="button" className="btn-outline px-4 py-1.5 text-xs">
                  Connect
                </button>
                <button type="button" className="btn-outline px-4 py-1.5 text-xs">
                  Follow
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alumniList.length === 0 && !loading && (
        <p className="py-10 text-center text-sm text-ink-body">
          No alumni match your filters yet — try broadening your search.
        </p>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            type="button"
            disabled={loading}
            onClick={() => runSearch(page + 1, true)}
            className="btn-outline"
          >
            {loading ? 'Loading...' : 'Load More Alumni'}
          </button>
        </div>
      )}
    </div>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const DEFAULT_INSTITUTION = {
  institutionName: 'ABC Institution',
  shortName: 'ABC',
  tagline: 'Democratic Blockchain Gateway',
  officialCode: 'ABC-INST-2026',
  returningOfficer: 'Dr. S. K. Narayanan',
  returningOfficerTitle: 'Chief Returning Officer',
  electoralBoard: 'ABC Institution Electoral Board',
  campusAddress: 'Main Academic Block, Tech City',
  contactEmail: 'elections@abcinstitution.edu'
};

const STORAGE_KEY = 'studentvoicex_institution_settings';

const InstitutionContext = createContext(null);

export function InstitutionProvider({ children }) {
  // Load initially from localStorage for instantaneous zero-flicker rendering
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.institutionName) {
          return { ...DEFAULT_INSTITUTION, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Could not read institution settings from localStorage', e);
    }
    return DEFAULT_INSTITUTION;
  });

  // Synchronize from backend on mount
  useEffect(() => {
    let isMounted = true;
    const syncFromBackend = async () => {
      try {
        const res = await api.institution.getSettings();
        if (res && res.institutionName && isMounted) {
          setSettings(prev => {
            const next = {
              ...prev,
              institutionName: res.institutionName || prev.institutionName,
              shortName: res.shortName || prev.shortName,
              tagline: res.tagline || prev.tagline,
              officialCode: res.officialCode || prev.officialCode,
              returningOfficer: res.returningOfficer || prev.returningOfficer,
              returningOfficerTitle: res.returningOfficerTitle || prev.returningOfficerTitle,
              electoralBoard: res.electoralBoard || prev.electoralBoard,
              campusAddress: res.campusAddress || prev.campusAddress,
              contactEmail: res.contactEmail || prev.contactEmail
            };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch (err) {}
            return next;
          });
        }
      } catch (err) {
        // Fallback to existing localStorage state
      }
    };
    syncFromBackend();

    // Cross-tab synchronization via storage events
    const handleStorageEvent = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.institutionName) {
            setSettings(parsed);
          }
        } catch (err) {}
      }
    };

    // In-app custom event broadcast
    const handleBroadcastEvent = (e) => {
      if (e.detail && e.detail.institutionName) {
        setSettings(e.detail);
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('studentvoicex:institution-changed', handleBroadcastEvent);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('studentvoicex:institution-changed', handleBroadcastEvent);
    };
  }, []);

  /**
   * Update institution settings globally across all tabs, backend, and localStorage
   */
  const updateInstitution = async (newFields) => {
    const updated = {
      ...settings,
      ...newFields
    };

    // Update local state immediately
    setSettings(updated);

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    // Broadcast in-app event for immediate reactive refresh
    window.dispatchEvent(
      new CustomEvent('studentvoicex:institution-changed', { detail: updated })
    );

    // Persist to backend database & disk
    try {
      await api.institution.updateSettings({
        institutionName: updated.institutionName,
        institution_name: updated.institutionName,
        shortName: updated.shortName,
        short_name: updated.shortName,
        tagline: updated.tagline,
        officialCode: updated.officialCode,
        official_code: updated.officialCode,
        returningOfficer: updated.returningOfficer,
        returning_officer: updated.returningOfficer,
        returningOfficerTitle: updated.returningOfficerTitle,
        returning_officer_title: updated.returningOfficerTitle,
        electoralBoard: updated.electoralBoard,
        electoral_board: updated.electoralBoard,
        campusAddress: updated.campusAddress,
        campus_address: updated.campusAddress,
        contactEmail: updated.contactEmail,
        contact_email: updated.contactEmail
      });
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }

    return updated;
  };

  return (
    <InstitutionContext.Provider
      value={{
        ...settings,
        institutionSettings: settings,
        updateInstitution
      }}
    >
      {children}
    </InstitutionContext.Provider>
  );
}

export const useInstitution = () => {
  const context = useContext(InstitutionContext);
  if (!context) {
    return {
      institutionName: 'ABC Institution',
      shortName: 'ABC',
      tagline: 'Democratic Blockchain Gateway',
      officialCode: 'ABC-INST-2026',
      returningOfficer: 'Dr. S. K. Narayanan',
      returningOfficerTitle: 'Chief Returning Officer',
      electoralBoard: 'ABC Institution Electoral Board',
      campusAddress: 'Main Academic Block, Tech City',
      contactEmail: 'elections@abcinstitution.edu',
      updateInstitution: async () => {}
    };
  }
  return context;
};

export default InstitutionContext;

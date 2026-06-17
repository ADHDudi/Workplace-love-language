import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveAssessmentResult, AssessmentResult } from '../src/lib/dbService';
import { auth, db } from '../src/lib/firebase';
import { addDoc, collection, serverTimestamp, getDoc, doc, query, getDocs, orderBy } from 'firebase/firestore';

// Mock Firebase
vi.mock('../src/lib/firebase', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'mocked-timestamp'),
  getDocs: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(() => 'mocked-orderBy'),
  getDoc: vi.fn(),
}));

describe('dbService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (auth as any).currentUser = null;
    delete (globalThis as any).__E2E_MOCK_USER__;
  });

  describe('saveAssessmentResult', () => {
    const mockData: Omit<AssessmentResult, 'userId' | 'createdAt'> = {
      userRole: 'employee',
      scores: { A: 5, B: 3, C: 2, D: 0, E: 1 },
      primaryStyle: 'A',
      answers: { 1: 'A', 2: 'B' },
    };

    it('should throw an error if the user is not authenticated', async () => {
      await expect(saveAssessmentResult(mockData)).rejects.toThrow('Must be authenticated to save assessment result.');
    });

    it('should call addDoc with correct data when user is authenticated', async () => {
      (auth as any).currentUser = {
        uid: 'test-user-123',
        email: 'test@example.com',
        displayName: 'Test User',
      };

      (addDoc as any).mockResolvedValueOnce({ id: 'new-doc-id' });
      (collection as any).mockReturnValue('mocked-collection-ref');

      const result = await saveAssessmentResult(mockData);

      expect(collection).toHaveBeenCalledWith(db, 'results');
      expect(addDoc).toHaveBeenCalledWith('mocked-collection-ref', {
        ...mockData,
        userId: 'test-user-123',
        userEmail: 'test@example.com',
        userName: 'Test User',
        createdAt: 'mocked-timestamp',
      });
      expect(result).toEqual({ id: 'new-doc-id' });
    });

    it('should handle mock user correctly', async () => {
      const originalWindow = (globalThis as any).window;
      (globalThis as any).window = { __E2E_MOCK_USER__: true };
      const result = await saveAssessmentResult(mockData);
      expect(result).toEqual({ id: 'mock-result-id' });
      expect(addDoc).not.toHaveBeenCalled();
      (globalThis as any).window = originalWindow;
    });
  });

  describe('getAssessmentResult', () => {
    it('should call getDoc and return data if it exists', async () => {
      const mockResultData = {
        userId: 'test-user',
        userRole: 'employee',
        scores: { A: 5, B: 3, C: 2, D: 0, E: 1 },
        primaryStyle: 'A',
        answers: { 1: 'A' },
      };

      (doc as any).mockReturnValueOnce('mocked-doc-ref');
      (getDoc as any).mockResolvedValueOnce({
        exists: () => true,
        id: 'some-doc-id',
        data: () => mockResultData,
      });

      const { getAssessmentResult } = await import('../src/lib/dbService');
      const result = await getAssessmentResult('some-doc-id');

      expect(doc).toHaveBeenCalledWith(db, 'results', 'some-doc-id');
      expect(getDoc).toHaveBeenCalledWith('mocked-doc-ref');
      expect(result).toEqual({ id: 'some-doc-id', ...mockResultData });
    });

    it('should return null if doc does not exist', async () => {
      (getDoc as any).mockResolvedValueOnce({
        exists: () => false,
      });

      const { getAssessmentResult } = await import('../src/lib/dbService');
      const result = await getAssessmentResult('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('listAllResults', () => {
    it('should query results collection and return docs', async () => {
      const mockResultDocs = [
        { id: '1', data: () => ({ primaryStyle: 'A' }) },
        { id: '2', data: () => ({ primaryStyle: 'B' }) }
      ];

      (query as any).mockReturnValueOnce('mocked-query');
      (getDocs as any).mockResolvedValueOnce({
        docs: mockResultDocs
      });

      const { listAllResults } = await import('../src/lib/dbService');
      const results = await listAllResults();

      expect(collection).toHaveBeenCalledWith(db, 'results');
      expect(query).toHaveBeenCalledWith('mocked-collection-ref', 'mocked-orderBy');
      expect(getDocs).toHaveBeenCalledWith('mocked-query');
      expect(results).toEqual([
        { id: '1', primaryStyle: 'A' },
        { id: '2', primaryStyle: 'B' }
      ]);
    });
  });
});

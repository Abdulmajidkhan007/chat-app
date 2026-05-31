import {
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  type ConfirmationResult,
  type User,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from '@/config/firebase';
import type { AuthUser } from '@/stores/auth.store';

// Holds the confirmation result between requestOTP and verifyOTP calls
let _pendingConfirmation: ConfirmationResult | null = null;

export const AuthService = {
  /**
   * Send OTP via Firebase Phone Auth.
   * `recaptchaVerifier` must be a FirebaseRecaptchaVerifierModal ref
   * (from expo-firebase-recaptcha) passed from the LoginScreen.
   */
  async requestOTP(
    phone: string,
    recaptchaVerifier: unknown
  ): Promise<{ success: boolean; message: string }> {
    try {
      _pendingConfirmation = await signInWithPhoneNumber(
        firebaseAuth,
        phone,
        recaptchaVerifier as Parameters<typeof signInWithPhoneNumber>[2]
      );
      return { success: true, message: `Code sent to ${phone}` };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send code';
      return { success: false, message };
    }
  },

  /**
   * Verify the 6-digit OTP entered by the user.
   */
  async verifyOTP(
    code: string
  ): Promise<{ success: boolean; isNewUser: boolean; uid: string; message: string }> {
    if (!_pendingConfirmation) {
      return { success: false, isNewUser: false, uid: '', message: 'No pending verification. Request a new code.' };
    }
    try {
      const credential = PhoneAuthProvider.credential(
        _pendingConfirmation.verificationId,
        code
      );
      const result = await signInWithCredential(firebaseAuth, credential);
      _pendingConfirmation = null;

      // Check if this is a new user (no profile doc in Firestore yet)
      const profileRef = doc(firebaseDb, 'users', result.user.uid);
      const profileSnap = await getDoc(profileRef);

      return {
        success: true,
        isNewUser: !profileSnap.exists(),
        uid: result.user.uid,
        message: 'Verified',
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Incorrect code';
      return { success: false, isNewUser: false, uid: '', message };
    }
  },

  /**
   * Save user profile to Firestore and return the AuthUser object.
   */
  async createProfile(data: {
    uid: string;
    phone: string;
    firstName: string;
    lastName?: string;
    username?: string;
    bio?: string;
    avatarUrl?: string;
  }): Promise<AuthUser> {
    const user: AuthUser = {
      id: data.uid,
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      bio: data.bio,
      avatarUrl: data.avatarUrl ?? `https://i.pravatar.cc/150?u=${data.uid}`,
      isVerified: false,
    };

    await setDoc(doc(firebaseDb, 'users', data.uid), {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return user;
  },

  /**
   * Load existing profile from Firestore.
   */
  async getProfile(uid: string): Promise<AuthUser | null> {
    const snap = await getDoc(doc(firebaseDb, 'users', uid));
    if (!snap.exists()) return null;
    return snap.data() as AuthUser;
  },

  /**
   * Update profile fields in Firestore.
   */
  async updateProfile(uid: string, patch: Partial<AuthUser>): Promise<void> {
    await setDoc(
      doc(firebaseDb, 'users', uid),
      { ...patch, updatedAt: serverTimestamp() },
      { merge: true }
    );
  },

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
  },

  /**
   * Listen to Firebase auth state. Calls onUser when signed in, onNull when signed out.
   * Returns unsubscribe function.
   */
  onAuthStateChanged(
    onUser: (user: User) => void,
    onNull: () => void
  ): () => void {
    return onAuthStateChanged(firebaseAuth, (user) => {
      if (user) onUser(user);
      else onNull();
    });
  },
};

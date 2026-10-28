const accountForm = document.querySelector("#student-account-form");
const studentPassword = document.querySelector("#student-password");
const studentPasswordConfirm = document.querySelector("#student-password-confirm");

if (accountForm) {
    const signupStatus = document.querySelector("#signup-status");
    const signupButton = accountForm.querySelector('button[type="submit"]');
    studentPasswordConfirm.addEventListener("input", () => studentPasswordConfirm.setCustomValidity(""));
    accountForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (studentPassword.value !== studentPasswordConfirm.value) {
            studentPasswordConfirm.setCustomValidity("Passwords do not match.");
            studentPasswordConfirm.reportValidity();
            return;
        }

        const supabase = window.ejireSupabase;
        if (!supabase) {
            signupStatus.textContent = "Supabase did not load. Check your internet connection and reload this page.";
            return;
        }

        signupButton.disabled = true;
        signupStatus.textContent = "Creating your student account...";
        try {
            const draft = {
                name: document.querySelector("#student-name").value.trim(),
                email: document.querySelector("#student-email").value.trim(),
                course: new URLSearchParams(window.location.search).get("course") || ""
            };
            const enrollmentUrl = new URL("student-enrollment.html", window.location.href);
            const confirmationUrl = new URL("login.html", window.location.href);
            confirmationUrl.searchParams.set("enroll", "1");
            if (draft.course) {
                enrollmentUrl.searchParams.set("course", draft.course);
                confirmationUrl.searchParams.set("course", draft.course);
            }
            const { data, error } = await supabase.auth.signUp({
                email: draft.email,
                password: studentPassword.value,
                options: {
                    data: { full_name: draft.name },
                    emailRedirectTo: confirmationUrl.href
                }
            });
            if (error) {
                signupStatus.textContent = error.message;
                return;
            }
            if (data.session) {
                window.location.href = enrollmentUrl.href;
                return;
            }
            signupStatus.textContent = "Check your email to confirm your account. The confirmation link will return you here to finish your learner profile.";
        } catch {
            signupStatus.textContent = "We could not reach Supabase. Check your connection and try again.";
        } finally {
            signupButton.disabled = false;
        }
    });
}

const loginForm = document.querySelector("#login-form");
if (loginForm) {
    const loginStatus = document.querySelector("#login-status");
    const loginButton = loginForm.querySelector('button[type="submit"]');
    const passwordUpdateForm = document.querySelector("#password-update-form");
    const passwordUpdateStatus = document.querySelector("#password-update-status");
    const routeSignedInUser = async (supabase, user, continueEnrollment) => {
        const { data: profileResult, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
        if (profileError || !profileResult) {
            await supabase.auth.signOut();
            loginStatus.textContent = "Sign-in worked, but the account profile is not ready. Check that the database setup step completed.";
            return;
        }

        if (profileResult.role === "student" && continueEnrollment) {
            const enrollmentUrl = new URL("student-enrollment.html", window.location.href);
            const course = new URLSearchParams(window.location.search).get("course");
            if (course) {
                enrollmentUrl.searchParams.set("course", course);
            }
            window.location.href = enrollmentUrl.href;
            return;
        }
        const accountType = profileResult.role === "admin" ? "administrator" : profileResult.role;
        loginStatus.textContent = `Signed in as ${accountType}. The ${accountType} workspace will be connected in a later step.`;
    };

    const confirmationParams = new URLSearchParams(window.location.search);
    const supabase = window.ejireSupabase;
    if (supabase) {
        supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") {
                loginForm.hidden = true;
                passwordUpdateForm.hidden = false;
                passwordUpdateStatus.textContent = "Choose a new password for your account.";
            }
        });
    }
    if (confirmationParams.get("enroll") === "1" && supabase) {
        supabase.auth.getSession().then(({ data, error }) => {
            if (error) {
                loginStatus.textContent = error.message;
            } else if (data.session) {
                routeSignedInUser(supabase, data.session.user, true);
            } else {
                loginStatus.textContent = "Email confirmed. Log in to finish your learner profile.";
            }
        }).catch(() => {
            loginStatus.textContent = "We could not confirm your session. Try logging in.";
        });
    }

    const passwordUpdateConfirm = document.querySelector("#new-password-confirm");
    passwordUpdateConfirm.addEventListener("input", () => passwordUpdateConfirm.setCustomValidity(""));
    passwordUpdateForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const supabaseClient = window.ejireSupabase;
        const newPassword = document.querySelector("#new-password").value;
        if (newPassword !== passwordUpdateConfirm.value) {
            passwordUpdateConfirm.setCustomValidity("Passwords do not match.");
            passwordUpdateConfirm.reportValidity();
            return;
        }
        if (!supabaseClient) {
            passwordUpdateStatus.textContent = "Supabase did not load. Check your connection and reload this page.";
            return;
        }
        const updateButton = passwordUpdateForm.querySelector('button[type="submit"]');
        updateButton.disabled = true;
        try {
            const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
            passwordUpdateStatus.textContent = error ? error.message : "Your password has been updated. You can now log in with it.";
            if (!error) {
                await supabaseClient.auth.signOut();
                passwordUpdateForm.hidden = true;
                loginForm.hidden = false;
            }
        } catch {
            passwordUpdateStatus.textContent = "We could not update your password. Check your connection and try again.";
        } finally {
            updateButton.disabled = false;
        }
    });

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const supabase = window.ejireSupabase;
        if (!supabase) {
            loginStatus.textContent = "Supabase did not load. Check your internet connection and reload this page.";
            return;
        }
        loginButton.disabled = true;
        loginStatus.textContent = "Signing in...";
        const email = document.querySelector("#login-email").value.trim();
        const password = document.querySelector("#login-password").value;
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                loginStatus.textContent = error.message;
                return;
            }
            await routeSignedInUser(supabase, data.user, confirmationParams.get("enroll") === "1");
        } catch {
            loginStatus.textContent = "We could not reach Supabase. Check your connection and try again.";
        } finally {
            loginButton.disabled = false;
        }
    });
    document.querySelector("#forgot-password").addEventListener("click", async () => {
        const email = document.querySelector("#login-email").value.trim();
        if (!email) {
            loginStatus.textContent = "Enter your email address first, then choose Forgot password.";
            document.querySelector("#login-email").focus();
            return;
        }
        const supabaseClient = window.ejireSupabase;
        if (!supabaseClient) {
            loginStatus.textContent = "Supabase did not load. Check your connection and reload this page.";
            return;
        }
        try {
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: new URL("login.html", window.location.href).href
            });
            loginStatus.textContent = error ? error.message : "If an account exists for that email, a password reset link is on its way.";
        } catch {
            loginStatus.textContent = "We could not reach Supabase. Check your connection and try again.";
        }
    });
}

const enrollmentForm = document.querySelector("#student-enrollment-form");
if (enrollmentForm) {
    const courseChoice = document.querySelector("#course-choice");
    const requestedCourse = new URLSearchParams(window.location.search).get("course");
    if (requestedCourse && [...courseChoice.options].some((option) => option.value === requestedCourse)) {
        courseChoice.value = requestedCourse;
    }

    const supabase = window.ejireSupabase;
    if (!supabase) {
        document.querySelector("#enrollment-status").textContent = "Supabase did not load. Check your internet connection and reload this page.";
    }
    supabase?.auth.getSession().then(({ data }) => {
        if (data.session) {
            document.querySelector("#student-account-label").textContent = `Signed in as ${data.session.user.email}. Complete and submit your learner profile.`;
        }
    }).catch(() => {
        document.querySelector("#enrollment-status").textContent = "We could not check your sign-in. Reload the page and try again.";
    });

    const accessSupportChoice = document.querySelector("#access-support-choice");
    const accessDetailsField = document.querySelector("#access-details-field");
    const ageGroup = document.querySelector("#age-group");
    const guardianField = document.querySelector("#guardian-consent-field");
    const guardianConsent = document.querySelector("#guardian-consent");
    const updateGuardianRequirement = () => {
        const guardianRequired = ageGroup.value === "13-17";
        guardianField.hidden = !guardianRequired;
        guardianConsent.required = guardianRequired;
        if (!guardianRequired) {
            guardianConsent.checked = false;
        }
    };
    ageGroup.addEventListener("change", updateGuardianRequirement);
    updateGuardianRequirement();
    accessSupportChoice.addEventListener("change", () => {
        accessDetailsField.hidden = accessSupportChoice.value !== "yes";
    });
    enrollmentForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const enrollmentStatus = document.querySelector("#enrollment-status");
        const supabase = window.ejireSupabase;
        if (!supabase) {
            enrollmentStatus.textContent = "Supabase did not load. Check your internet connection and reload this page.";
            return;
        }
        const submitButton = enrollmentForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        try {
        const { data: sessionResult } = await supabase.auth.getSession();
        if (!sessionResult.session) {
            enrollmentStatus.textContent = "Please log in before submitting your learner profile.";
            return;
        }

        const formData = new FormData(enrollmentForm);
        const enrollment = {
            user_id: sessionResult.session.user.id,
            course: formData.get("course"),
            age_group: formData.get("age-group"),
            guardian_approved: formData.get("guardian-consent") === "on",
            education_level: formData.get("education-level"),
            class_year: formData.get("class-year")?.trim() || null,
            current_status: formData.get("status"),
            experience_level: formData.get("experience"),
            access_support_requested: formData.get("access-support") === "" ? null : formData.get("access-support") === "yes",
            access_needs: formData.get("access-details")?.trim() || null,
            learning_goal: formData.get("goal")?.trim() || null,
            device_access: formData.get("device")
        };
        const { error } = await supabase.from("student_enrollments").upsert(enrollment, { onConflict: "user_id,course" });
        if (error) {
            enrollmentStatus.textContent = error.message;
            return;
        }
        enrollmentStatus.textContent = "Your learner profile has been submitted successfully.";
        } catch {
            enrollmentStatus.textContent = "We could not submit your learner profile. Check your connection and try again.";
        } finally {
            submitButton.disabled = false;
        }
    });
}

const instructorForm = document.querySelector("#instructor-invite-form");
if (instructorForm) {
    const inviteCode = new URLSearchParams(window.location.search).get("invite");
    if (inviteCode) {
        document.querySelector("#invite-code").value = inviteCode;
    }
    const instructorPassword = document.querySelector("#instructor-password");
    const instructorPasswordConfirm = document.querySelector("#instructor-password-confirm");
    instructorPasswordConfirm.addEventListener("input", () => instructorPasswordConfirm.setCustomValidity(""));
    instructorForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (instructorPassword.value !== instructorPasswordConfirm.value) {
            instructorPasswordConfirm.setCustomValidity("Passwords do not match.");
            instructorPasswordConfirm.reportValidity();
            return;
        }
        document.querySelector("#instructor-status").textContent = "The invitation could not be verified in this preview. No instructor account was created.";
    });
}
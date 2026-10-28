const supabaseUrl = "https://ksbmozrazwgibhbfvzar.supabase.co";
const supabasePublishableKey = "sb_publishable_I_B0ZkaL-kBYssy8vRl7vw_UFclWMHM";

if (window.supabase?.createClient) {
    window.ejireSupabase = window.supabase.createClient(supabaseUrl, supabasePublishableKey);
}
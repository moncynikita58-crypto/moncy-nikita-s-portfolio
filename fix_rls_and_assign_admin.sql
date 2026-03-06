-- ============================================
-- FIX: Change all RESTRICTIVE policies to PERMISSIVE
-- and add missing UPDATE/DELETE on contact_messages
-- ============================================

-- Drop all existing restrictive policies and recreate as permissive

-- ========== applications ==========
DROP POLICY IF EXISTS "Anyone can submit application" ON public.applications;
DROP POLICY IF EXISTS "Admins can read applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;

CREATE POLICY "Anyone can submit application" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read applications" ON public.applications FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update applications" ON public.applications FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ========== blog_posts ==========
DROP POLICY IF EXISTS "Anyone can read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can insert blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can update blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog_posts" ON public.blog_posts;

CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts FOR SELECT USING ((published = true) OR public.is_admin());
CREATE POLICY "Admins can insert blog_posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update blog_posts" ON public.blog_posts FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete blog_posts" ON public.blog_posts FOR DELETE TO authenticated USING (public.is_admin());

-- ========== contact_messages ==========
DROP POLICY IF EXISTS "Anyone can submit contact message" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can read contact_messages" ON public.contact_messages;

CREATE POLICY "Anyone can submit contact message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read contact_messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update contact_messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete contact_messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.is_admin());

-- ========== invitation_payments ==========
DROP POLICY IF EXISTS "Anyone can insert invitation_payments" ON public.invitation_payments;
DROP POLICY IF EXISTS "Anyone can read invitation_payments" ON public.invitation_payments;
DROP POLICY IF EXISTS "Anyone can update invitation_payments" ON public.invitation_payments;

CREATE POLICY "Anyone can insert invitation_payments" ON public.invitation_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read invitation_payments" ON public.invitation_payments FOR SELECT USING (true);
CREATE POLICY "Anyone can update invitation_payments" ON public.invitation_payments FOR UPDATE USING (true) WITH CHECK (true);

-- ========== invitation_tokens ==========
DROP POLICY IF EXISTS "Admins can insert invitation_tokens" ON public.invitation_tokens;
DROP POLICY IF EXISTS "Anyone can read invitation by token" ON public.invitation_tokens;
DROP POLICY IF EXISTS "Anyone can update invitation_tokens" ON public.invitation_tokens;

CREATE POLICY "Admins can insert invitation_tokens" ON public.invitation_tokens FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Anyone can read invitation by token" ON public.invitation_tokens FOR SELECT USING (true);
CREATE POLICY "Anyone can update invitation_tokens" ON public.invitation_tokens FOR UPDATE USING (true) WITH CHECK (true);

-- ========== job_listings ==========
DROP POLICY IF EXISTS "Anyone can read job_listings" ON public.job_listings;
DROP POLICY IF EXISTS "Admins can insert job_listings" ON public.job_listings;
DROP POLICY IF EXISTS "Admins can update job_listings" ON public.job_listings;
DROP POLICY IF EXISTS "Admins can delete job_listings" ON public.job_listings;

CREATE POLICY "Anyone can read job_listings" ON public.job_listings FOR SELECT USING (true);
CREATE POLICY "Admins can insert job_listings" ON public.job_listings FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update job_listings" ON public.job_listings FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete job_listings" ON public.job_listings FOR DELETE TO authenticated USING (public.is_admin());

-- ========== profiles ==========
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING ((user_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ========== user_roles ==========
DROP POLICY IF EXISTS "Admins can read user_roles" ON public.user_roles;

CREATE POLICY "Admins can read user_roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());

-- ============================================
-- ASSIGN ADMIN ROLE to moncynikita58@gmail.com
-- ============================================
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'moncynikita58@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

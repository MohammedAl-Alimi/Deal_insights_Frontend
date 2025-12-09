-- ============================================================================
-- CONTROLLED VOCABULARY - INSERT VALUES
-- ============================================================================
-- This populates the controlled_vocabulary table with allowed values
-- Based on your Excel "keyword rules" sheet
-- ============================================================================

-- Strategy/Tactic options
INSERT INTO controlled_vocabulary (field_name, allowed_value, display_label, notes, sort_order) VALUES
    ('Strategy_Tactic', 'event_apparel', 'Event + Apparel', 'Events tied to apparel/lookbooks', 1),
    ('Strategy_Tactic', 'event_sponsorship', 'Event + Sponsorship', 'Events with partners/sponsors', 2),
    ('Strategy_Tactic', 'experiential_activation', 'Experiential Activation', 'Interactive/experiential campaigns', 3),
    ('Strategy_Tactic', 'apparel_design', 'Apparel Design', 'Kits, jerseys, apparel collaborations', 4),
    ('Strategy_Tactic', 'branding_identity', 'Branding & Identity', 'Logo/brand/identity projects', 5),
    ('Strategy_Tactic', 'workshop_cocreation', 'Workshop & Co-creation', 'Workshops, co-creation sessions', 6),
    ('Strategy_Tactic', 'digital_social', 'Digital & Social', 'Digital/social media campaigns', 7),
    ('Strategy_Tactic', 'ooh_activation', 'OOH Activation', 'Out-of-home activations', 8);

-- Deal Status options
INSERT INTO controlled_vocabulary (field_name, allowed_value, display_label, notes, sort_order) VALUES
    ('Deal_Status', 'signed', 'Signed', 'Deal was signed/approved', 1),
    ('Deal_Status', 'not_signed', 'Not Signed', 'Deal not signed', 2);

-- Project Status options
INSERT INTO controlled_vocabulary (field_name, allowed_value, display_label, notes, sort_order) VALUES
    ('Project_Status', 'ongoing', 'Ongoing', 'Project currently in progress', 1),
    ('Project_Status', 'completed', 'Completed', 'Project finished successfully', 2),
    ('Project_Status', 'not_executed', 'Not Executed', 'Project not executed/cancelled', 3);

-- Industry options (add more as needed)
INSERT INTO controlled_vocabulary (field_name, allowed_value, display_label, notes, sort_order) VALUES
    ('Industry', 'sportswear', 'Sportswear / Lifestyle Retail', 'Sports apparel and lifestyle brands', 1),
    ('Industry', 'consumer_electronics', 'Consumer Electronics / Home Appliances', 'Electronics and appliances', 2),
    ('Industry', 'sports_football', 'Sports / Football', 'Football/soccer related', 3),
    ('Industry', 'automotive', 'Automotive', 'Car manufacturers and related', 4),
    ('Industry', 'technology', 'Technology', 'Tech companies and services', 5),
    ('Industry', 'finance', 'Finance & Banking', 'Financial services', 6),
    ('Industry', 'retail', 'Retail', 'General retail', 7),
    ('Industry', 'healthcare', 'Healthcare', 'Healthcare and medical', 8);

-- Market/Region options
INSERT INTO controlled_vocabulary (field_name, allowed_value, display_label, notes, sort_order) VALUES
    ('Market', 'europe', 'Europe', 'European markets', 1),
    ('Market', 'north_america', 'North America', 'USA, Canada, Mexico', 2),
    ('Market', 'asia', 'Asia', 'Asian markets', 3),
    ('Market', 'global', 'Global', 'Worldwide/multiple regions', 4),
    ('Market', 'germany', 'Germany', 'Germany specifically', 5),
    ('Market', 'france', 'France', 'France specifically', 6),
    ('Market', 'uk', 'United Kingdom', 'UK specifically', 7);

-- Budget Range options
INSERT INTO controlled_vocabulary (field_name, allowed_value, display_label, notes, sort_order) VALUES
    ('Budget_Range', 'under_50k', 'Under €50K', 'Budget under 50,000 euros', 1),
    ('Budget_Range', '50k_100k', '€50K - €100K', '50,000 to 100,000 euros', 2),
    ('Budget_Range', '100k_250k', '€100K - €250K', '100,000 to 250,000 euros', 3),
    ('Budget_Range', '250k_500k', '€250K - €500K', '250,000 to 500,000 euros', 4),
    ('Budget_Range', '500k_1m', '€500K - €1M', '500,000 to 1 million euros', 5),
    ('Budget_Range', 'over_1m', 'Over €1M', 'Budget over 1 million euros', 6),
    ('Budget_Range', 'not_disclosed', 'Not Disclosed', 'Budget not mentioned', 7);

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this to see all controlled vocabulary values:
-- SELECT field_name, COUNT(*) as value_count FROM controlled_vocabulary GROUP BY field_name ORDER BY field_name;

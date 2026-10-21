import os

def create_svg_diagrams():
    diagrams_dir = os.path.abspath("docs/diagrams")
    os.makedirs(diagrams_dir, exist_ok=True)

    # ========================================================
    # 1. USE CASE DIAGRAM SVG
    # ========================================================
    svg_use_case = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 720" width="100%" height="100%" style="background:#F8FAFC; font-family:'Segoe UI', Inter, Arial, sans-serif;">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1" />
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#123B5D" />
    </marker>
    <marker id="dash-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748B" />
    </marker>
  </defs>

  <!-- Title Banner -->
  <rect x="20" y="15" width="960" height="50" rx="8" fill="#123B5D" />
  <text x="500" y="46" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="700">Use Case Diagram — TravelMate Smart Tourist Day-Visit Planner</text>

  <!-- System Boundary Box -->
  <rect x="230" y="85" width="540" height="610" rx="12" fill="#FFFFFF" stroke="#13B8A6" stroke-width="2.5" stroke-dasharray="8 5" filter="url(#shadow)" />
  <rect x="245" y="95" width="280" height="26" rx="4" fill="#E6FFFA" />
  <text x="255" y="113" fill="#0D9488" font-size="12" font-weight="700">SYSTEM: TravelMate Application</text>

  <!-- ACTOR 1: TOURIST (Left) -->
  <g transform="translate(90, 240)">
    <!-- Stick figure -->
    <circle cx="35" cy="20" r="15" fill="#FFFFFF" stroke="#123B5D" stroke-width="3" />
    <line x1="35" y1="35" x2="35" y2="75" stroke="#123B5D" stroke-width="3" />
    <line x1="10" y1="50" x2="60" y2="50" stroke="#123B5D" stroke-width="3" />
    <line x1="35" y1="75" x2="15" y2="115" stroke="#123B5D" stroke-width="3" />
    <line x1="35" y1="75" x2="55" y2="115" stroke="#123B5D" stroke-width="3" />
    <text x="35" y="140" text-anchor="middle" fill="#123B5D" font-size="14" font-weight="700">Tourist</text>
    <text x="35" y="158" text-anchor="middle" fill="#64748B" font-size="11">(End User)</text>
  </g>

  <!-- ACTOR 2: ADMINISTRATOR (Right) -->
  <g transform="translate(840, 320)">
    <!-- Stick figure with badge -->
    <circle cx="35" cy="20" r="15" fill="#FFFFFF" stroke="#123B5D" stroke-width="3" />
    <line x1="35" y1="35" x2="35" y2="75" stroke="#123B5D" stroke-width="3" />
    <line x1="10" y1="50" x2="60" y2="50" stroke="#123B5D" stroke-width="3" />
    <line x1="35" y1="75" x2="15" y2="115" stroke="#123B5D" stroke-width="3" />
    <line x1="35" y1="75" x2="55" y2="115" stroke="#123B5D" stroke-width="3" />
    <text x="35" y="140" text-anchor="middle" fill="#123B5D" font-size="14" font-weight="700">Administrator</text>
    <text x="35" y="158" text-anchor="middle" fill="#64748B" font-size="11">(Staff / Site Manager)</text>
  </g>

  <!-- USE CASES (Ovals) -->
  <!-- UC1: Browse Attractions -->
  <ellipse cx="400" cy="140" rx="100" ry="24" fill="#F0FDFA" stroke="#13B8A6" stroke-width="2" />
  <text x="400" y="145" text-anchor="middle" fill="#172B4D" font-size="12" font-weight="600">Browse Attractions</text>

  <!-- UC2: Search & Filter Attractions -->
  <ellipse cx="400" cy="200" rx="110" ry="24" fill="#F0FDFA" stroke="#13B8A6" stroke-width="2" />
  <text x="400" y="205" text-anchor="middle" fill="#172B4D" font-size="12" font-weight="600">Search &amp; Filter Attractions</text>

  <!-- UC3: View Destination Details -->
  <ellipse cx="400" cy="260" rx="110" ry="24" fill="#F0FDFA" stroke="#13B8A6" stroke-width="2" />
  <text x="400" y="265" text-anchor="middle" fill="#172B4D" font-size="12" font-weight="600">View Destination Details</text>

  <!-- UC4: Shortlist Destinations -->
  <ellipse cx="400" cy="320" rx="105" ry="24" fill="#F0FDFA" stroke="#13B8A6" stroke-width="2" />
  <text x="400" y="325" text-anchor="middle" fill="#172B4D" font-size="12" font-weight="600">Select Destinations (Shortlist)</text>

  <!-- UC5: Generate Day Itinerary -->
  <ellipse cx="400" cy="380" rx="115" ry="24" fill="#FEF3C7" stroke="#F59E42" stroke-width="2" />
  <text x="400" y="385" text-anchor="middle" fill="#92400E" font-size="12" font-weight="700">Generate Day Itinerary</text>

  <!-- UC6: Save / Export PDF -->
  <ellipse cx="610" cy="380" rx="90" ry="22" fill="#F1F5F9" stroke="#64748B" stroke-width="1.8" />
  <text x="610" y="384" text-anchor="middle" fill="#334155" font-size="11" font-weight="600">Save / Export Itinerary</text>

  <!-- UC7: View Google Maps Route -->
  <ellipse cx="400" cy="440" rx="110" ry="24" fill="#F0FDFA" stroke="#13B8A6" stroke-width="2" />
  <text x="400" y="445" text-anchor="middle" fill="#172B4D" font-size="12" font-weight="600">View Google Maps Route</text>

  <!-- UC8: Submit Contact Inquiry -->
  <ellipse cx="400" cy="500" rx="105" ry="24" fill="#F0FDFA" stroke="#13B8A6" stroke-width="2" />
  <text x="400" y="505" text-anchor="middle" fill="#172B4D" font-size="12" font-weight="600">Submit Contact Inquiry</text>

  <!-- ADMIN USE CASES -->
  <!-- UC9: Admin Login -->
  <ellipse cx="580" cy="530" rx="95" ry="24" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2" />
  <text x="580" y="535" text-anchor="middle" fill="#1E40AF" font-size="12" font-weight="600">Admin Authentication</text>

  <!-- UC10: Manage Destinations (CRUD) -->
  <ellipse cx="580" cy="590" rx="105" ry="24" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2" />
  <text x="580" y="595" text-anchor="middle" fill="#1E40AF" font-size="12" font-weight="600">Manage Destinations (CRUD)</text>

  <!-- UC11: Review Inquiries -->
  <ellipse cx="580" cy="650" rx="95" ry="24" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2" />
  <text x="580" y="655" text-anchor="middle" fill="#1E40AF" font-size="12" font-weight="600">Review Tourist Inquiries</text>

  <!-- ASSOCIATIONS (Tourist to UCs) -->
  <line x1="145" y1="290" x2="305" y2="145" stroke="#123B5D" stroke-width="1.8" />
  <line x1="145" y1="295" x2="295" y2="200" stroke="#123B5D" stroke-width="1.8" />
  <line x1="145" y1="300" x2="290" y2="260" stroke="#123B5D" stroke-width="1.8" />
  <line x1="145" y1="310" x2="295" y2="320" stroke="#123B5D" stroke-width="1.8" />
  <line x1="145" y1="315" x2="285" y2="380" stroke="#123B5D" stroke-width="2" />
  <line x1="145" y1="320" x2="292" y2="440" stroke="#123B5D" stroke-width="1.8" />
  <line x1="145" y1="325" x2="298" y2="500" stroke="#123B5D" stroke-width="1.8" />

  <!-- ASSOCIATIONS (Admin to UCs) -->
  <line x1="840" y1="370" x2="675" y2="530" stroke="#123B5D" stroke-width="1.8" />
  <line x1="840" y1="380" x2="685" y2="590" stroke="#123B5D" stroke-width="1.8" />
  <line x1="840" y1="390" x2="675" y2="650" stroke="#123B5D" stroke-width="1.8" />

  <!-- EXTEND: UC5 -> UC6 -->
  <line x1="515" y1="380" x2="520" y2="380" stroke="#64748B" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#dash-arrow)" />
  <text x="548" y="372" fill="#64748B" font-size="10" font-style="italic">&lt;&lt;extend&gt;&gt;</text>
</svg>
"""

    with open(os.path.join(diagrams_dir, "use_case_diagram.svg"), "w", encoding="utf-8") as f:
        f.write(svg_use_case)

    # ========================================================
    # 2. ACTIVITY DIAGRAM SVG
    # ========================================================
    svg_activity = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900" width="100%" height="100%" style="background:#F8FAFC; font-family:'Segoe UI', Inter, Arial, sans-serif;">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1" />
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#123B5D" />
    </marker>
  </defs>

  <!-- Title Banner -->
  <rect x="20" y="15" width="860" height="50" rx="8" fill="#123B5D" />
  <text x="450" y="46" text-anchor="middle" fill="#FFFFFF" font-size="18" font-weight="700">Activity Diagram — Smart One-Day Itinerary Planning Process</text>

  <!-- Start Node -->
  <circle cx="450" cy="100" r="14" fill="#123B5D" />
  <line x1="450" y1="114" x2="450" y2="140" stroke="#123B5D" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Action 1: Browse & Shortlist -->
  <rect x="330" y="140" width="240" height="42" rx="10" fill="#FFFFFF" stroke="#13B8A6" stroke-width="2" filter="url(#shadow)" />
  <text x="450" y="166" text-anchor="middle" fill="#172B4D" font-size="13" font-weight="600">Select Attractions from Catalog</text>
  <line x1="450" y1="182" x2="450" y2="210" stroke="#123B5D" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Decision 1: Shortlist Count >= 1 -->
  <polygon points="450,210 500,235 450,260 400,235" fill="#FEF3C7" stroke="#F59E42" stroke-width="2" />
  <text x="450" y="239" text-anchor="middle" fill="#92400E" font-size="10" font-weight="700">Count ≥ 1?</text>

  <!-- Loop back if 0 -->
  <line x1="400" y1="235" x2="280" y2="235" stroke="#DC2626" stroke-width="2" />
  <line x1="280" y1="235" x2="280" y2="161" stroke="#DC2626" stroke-width="2" />
  <line x1="280" y1="161" x2="330" y2="161" stroke="#DC2626" stroke-width="2" marker-end="url(#arrow)" />
  <text x="310" y="228" fill="#DC2626" font-size="11" font-weight="600">[No: Count = 0]</text>

  <!-- Continue if >= 1 -->
  <line x1="450" y1="260" x2="450" y2="295" stroke="#123B5D" stroke-width="2" marker-end="url(#arrow)" />
  <text x="460" y="280" fill="#0D9488" font-size="11" font-weight="700">[Yes]</text>

  <!-- Action 2: Input Preferences -->
  <rect x="300" y="295" width="300" height="42" rx="10" fill="#FFFFFF" stroke="#13B8A6" stroke-width="2" filter="url(#shadow)" />
  <text x="450" y="321" text-anchor="middle" fill="#172B4D" font-size="12" font-weight="600">Input Trip Preferences (Start/End Time, Vehicle)</text>
  <line x1="450" y1="337" x2="450" y2="365" stroke="#123B5D" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Action 3: Trigger Nearest-Neighbour Calculation Engine -->
  <rect x="290" y="365" width="320" height="44" rx="10" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2" filter="url(#shadow)" />
  <text x="450" y="392" text-anchor="middle" fill="#1E40AF" font-size="13" font-weight="700">Anchor Origin at Atulugama (6.7022, 80.0528)</text>
  <line x1="450" y1="409" x2="450" y2="435" stroke="#123B5D" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Action 4: Compute Road Distance Matrix -->
  <rect x="290" y="435" width="320" height="44" rx="10" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2" filter="url(#shadow)" />
  <text x="450" y="462" text-anchor="middle" fill="#1E40AF" font-size="12" font-weight="600">Compute Haversine Distance × 1.25 Road Factor</text>
  <line x1="450" y1="479" x2="450" y2="505" stroke="#123B5D" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Action 5: Sequence Stops -->
  <rect x="300" y="505" width="300" height="44" rx="10" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2" filter="url(#shadow)" />
  <text x="450" y="532" text-anchor="middle" fill="#1E40AF" font-size="12" font-weight="600">Greedy Nearest-Neighbour Sequencing</text>
  <line x1="450" y1="549" x2="450" y2="575" stroke="#123B5D" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Decision 2: Midday Lunch Break -->
  <polygon points="450,575 510,600 450,625 390,600" fill="#FEF3C7" stroke="#F59E42" stroke-width="2" />
  <text x="450" y="604" text-anchor="middle" fill="#92400E" font-size="10" font-weight="700">Spans 12:30-13:30?</text>

  <!-- Branch: Yes, Insert Lunch -->
  <line x1="510" y1="600" x2="620" y2="600" stroke="#123B5D" stroke-width="2" />
  <line x1="620" y1="600" x2="620" y2="640" stroke="#123B5D" stroke-width="2" marker-end="url(#arrow)" />
  <rect x="540" y="640" width="160" height="36" rx="8" fill="#FFFBEB" stroke="#F59E42" stroke-width="1.5" />
  <text x="620" y="662" text-anchor="middle" fill="#B45309" font-size="11" font-weight="600">Insert 60m Lunch Break</text>
  <line x1="620" y1="676" x2="620" y2="705" stroke="#123B5D" stroke-width="2" />
  <line x1="620" y1="705" x2="480" y2="705" stroke="#123B5D" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Branch: No Lunch -->
  <line x1="450" y1="625" x2="450" y2="685" stroke="#123B5D" stroke-width="2" marker-end="url(#arrow)" />
  <text x="458" y="645" fill="#64748B" font-size="10">[No]</text>

  <!-- Action 6: Render Interactive Schedule -->
  <rect x="300" y="685" width="300" height="44" rx="10" fill="#F0FDFA" stroke="#13B8A6" stroke-width="2" filter="url(#shadow)" />
  <text x="450" y="712" text-anchor="middle" fill="#0D9488" font-size="13" font-weight="700">Render Timed Timeline &amp; Google Map</text>
  <line x1="450" y1="729" x2="450" y2="760" stroke="#123B5D" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Action 7: Export / Save -->
  <rect x="320" y="760" width="260" height="40" rx="10" fill="#FFFFFF" stroke="#64748B" stroke-width="2" filter="url(#shadow)" />
  <text x="450" y="785" text-anchor="middle" fill="#172B4D" font-size="12" font-weight="600">Save to Account / Export PDF</text>
  <line x1="450" y1="800" x2="450" y2="835" stroke="#123B5D" stroke-width="2" marker-end="url(#arrow)" />

  <!-- Final Node (Bullseye) -->
  <circle cx="450" cy="850" r="16" fill="#FFFFFF" stroke="#123B5D" stroke-width="2" />
  <circle cx="450" cy="850" r="10" fill="#123B5D" />
</svg>
"""

    with open(os.path.join(diagrams_dir, "activity_diagram.svg"), "w", encoding="utf-8") as f:
        f.write(svg_activity)

    # ========================================================
    # 3. SEQUENCE DIAGRAM SVG
    # ========================================================
    svg_sequence = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 650" width="100%" height="100%" style="background:#F8FAFC; font-family:'Segoe UI', Inter, Arial, sans-serif;">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1" />
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#123B5D" />
    </marker>
    <marker id="dash-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0D9488" />
    </marker>
  </defs>

  <!-- Title Banner -->
  <rect x="20" y="15" width="960" height="50" rx="8" fill="#123B5D" />
  <text x="500" y="46" text-anchor="middle" fill="#FFFFFF" font-size="18" font-weight="700">Sequence Diagram — Day Itinerary Generation (POST /api/itineraries/generate)</text>

  <!-- LIFELINE HEADERS -->
  <!-- 1. Tourist -->
  <rect x="40" y="90" width="120" height="40" rx="6" fill="#123B5D" />
  <text x="100" y="115" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="600">Tourist (Actor)</text>
  <line x1="100" y1="130" x2="100" y2="600" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="6 4" />

  <!-- 2. Frontend -->
  <rect x="210" y="90" width="130" height="40" rx="6" fill="#13B8A6" />
  <text x="275" y="115" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="600">itinerary.js (UI)</text>
  <line x1="275" y1="130" x2="275" y2="600" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="6 4" />

  <!-- 3. Controller -->
  <rect x="390" y="90" width="150" height="40" rx="6" fill="#123B5D" />
  <text x="465" y="115" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="600">ItineraryController</text>
  <line x1="465" y1="130" x2="465" y2="600" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="6 4" />

  <!-- 4. Service -->
  <rect x="580" y="90" width="140" height="40" rx="6" fill="#123B5D" />
  <text x="650" y="115" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="600">ItineraryService</text>
  <line x1="650" y1="130" x2="650" y2="600" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="6 4" />

  <!-- 5. Repository -->
  <rect x="750" y="90" width="150" height="40" rx="6" fill="#123B5D" />
  <text x="825" y="115" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="600">AttractionRepository</text>
  <line x1="825" y1="130" x2="825" y2="600" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="6 4" />

  <!-- ACTIVATION BOXES -->
  <rect x="95" y="150" width="10" height="410" fill="#94A3B8" />
  <rect x="270" y="165" width="10" height="380" fill="#13B8A6" />
  <rect x="460" y="200" width="10" height="310" fill="#3B82F6" />
  <rect x="645" y="235" width="10" height="240" fill="#F59E42" />
  <rect x="820" y="265" width="10" height="60" fill="#10B981" />

  <!-- MESSAGES -->
  <!-- 1. Click Generate -->
  <line x1="105" y1="170" x2="268" y2="170" stroke="#123B5D" stroke-width="1.8" marker-end="url(#arrow)" />
  <text x="187" y="162" text-anchor="middle" fill="#1E293B" font-size="11" font-weight="600">1: Click "Generate Itinerary"</text>

  <!-- 2. POST HTTP -->
  <line x1="280" y1="205" x2="458" y2="205" stroke="#123B5D" stroke-width="1.8" marker-end="url(#arrow)" />
  <text x="370" y="197" text-anchor="middle" fill="#1E293B" font-size="11" font-weight="600">2: POST /api/itineraries/generate</text>

  <!-- 3. Service Call -->
  <line x1="470" y1="240" x2="643" y2="240" stroke="#123B5D" stroke-width="1.8" marker-end="url(#arrow)" />
  <text x="557" y="232" text-anchor="middle" fill="#1E293B" font-size="11" font-weight="600">3: generateItinerary(request)</text>

  <!-- 4. Repo Query -->
  <line x1="655" y1="270" x2="818" y2="270" stroke="#123B5D" stroke-width="1.8" marker-end="url(#arrow)" />
  <text x="737" y="262" text-anchor="middle" fill="#1E293B" font-size="11" font-weight="600">4: findAllById(selectedIds)</text>

  <!-- 5. Return List -->
  <line x1="818" y1="315" x2="655" y2="315" stroke="#0D9488" stroke-width="1.8" stroke-dasharray="5 3" marker-end="url(#dash-arrow)" />
  <text x="737" y="307" text-anchor="middle" fill="#0D9488" font-size="11" font-weight="600">5: List&lt;Attraction&gt; (GPS, Durations)</text>

  <!-- Self Note / Computation -->
  <rect x="585" y="340" width="220" height="65" rx="6" fill="#FFFBEB" stroke="#F59E42" stroke-width="1.5" />
  <text x="595" y="358" fill="#92400E" font-size="10" font-weight="700">Internal Optimization Engine:</text>
  <text x="595" y="373" fill="#78350F" font-size="9.5">• Haversine distance matrix × 1.25</text>
  <text x="595" y="387" fill="#78350F" font-size="9.5">• Nearest-neighbour sequence</text>
  <text x="595" y="400" fill="#78350F" font-size="9.5">• Inject midday lunch break</text>

  <!-- 6. Service return DTO -->
  <line x1="645" y1="465" x2="472" y2="465" stroke="#0D9488" stroke-width="1.8" stroke-dasharray="5 3" marker-end="url(#dash-arrow)" />
  <text x="558" y="457" text-anchor="middle" fill="#0D9488" font-size="11" font-weight="600">6: ItineraryDTO (stops, timeline)</text>

  <!-- 7. Controller HTTP 200 -->
  <line x1="460" y1="500" x2="282" y2="500" stroke="#0D9488" stroke-width="1.8" stroke-dasharray="5 3" marker-end="url(#dash-arrow)" />
  <text x="371" y="492" text-anchor="middle" fill="#0D9488" font-size="11" font-weight="600">7: 200 OK (ApiResponse&lt;ItineraryDTO&gt;)</text>

  <!-- 8. Render UI -->
  <line x1="270" y1="535" x2="107" y2="535" stroke="#0D9488" stroke-width="1.8" stroke-dasharray="5 3" marker-end="url(#dash-arrow)" />
  <text x="188" y="527" text-anchor="middle" fill="#0D9488" font-size="11" font-weight="600">8: Render Clock Timeline &amp; Google Map</text>
</svg>
"""

    with open(os.path.join(diagrams_dir, "sequence_diagram.svg"), "w", encoding="utf-8") as f:
        f.write(svg_sequence)

    # ========================================================
    # 4. CLASS DIAGRAM SVG
    # ========================================================
    svg_class = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 780" width="100%" height="100%" style="background:#F8FAFC; font-family:'Segoe UI', Inter, Arial, sans-serif;">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1" />
    </filter>
  </defs>

  <!-- Title Banner -->
  <rect x="20" y="15" width="1010" height="50" rx="8" fill="#123B5D" />
  <text x="525" y="46" text-anchor="middle" fill="#FFFFFF" font-size="18" font-weight="700">Class Diagram — TravelMate Architectural Class Hierarchy</text>

  <!-- Class 1: User -->
  <g transform="translate(40, 90)">
    <rect x="0" y="0" width="220" height="150" rx="6" fill="#FFFFFF" stroke="#123B5D" stroke-width="2" filter="url(#shadow)" />
    <rect x="0" y="0" width="220" height="30" rx="6" fill="#123B5D" />
    <text x="110" y="21" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">User</text>
    <text x="12" y="50" fill="#334155" font-size="10">- id: Long</text>
    <text x="12" y="66" fill="#334155" font-size="10">- fullName: String</text>
    <text x="12" y="82" fill="#334155" font-size="10">- email: String</text>
    <text x="12" y="98" fill="#334155" font-size="10">- password: String</text>
    <text x="12" y="114" fill="#334155" font-size="10">- role: Role</text>
    <line x1="0" y1="124" x2="220" y2="124" stroke="#CBD5E1" stroke-width="1" />
    <text x="12" y="140" fill="#0D9488" font-size="10">+ getId(): Long</text>
  </g>

  <!-- Class 2: Itinerary -->
  <g transform="translate(340, 90)">
    <rect x="0" y="0" width="250" height="180" rx="6" fill="#FFFFFF" stroke="#123B5D" stroke-width="2" filter="url(#shadow)" />
    <rect x="0" y="0" width="250" height="30" rx="6" fill="#123B5D" />
    <text x="125" y="21" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">Itinerary</text>
    <text x="12" y="50" fill="#334155" font-size="10">- id: Long</text>
    <text x="12" y="66" fill="#334155" font-size="10">- user: User</text>
    <text x="12" y="82" fill="#334155" font-size="10">- planName: String</text>
    <text x="12" y="98" fill="#334155" font-size="10">- visitDate: LocalDate</text>
    <text x="12" y="114" fill="#334155" font-size="10">- startTime: String</text>
    <text x="12" y="130" fill="#334155" font-size="10">- endTime: String</text>
    <text x="12" y="146" fill="#334155" font-size="10">- travelMode: String</text>
    <line x1="0" y1="154" x2="250" y2="154" stroke="#CBD5E1" stroke-width="1" />
    <text x="12" y="170" fill="#0D9488" font-size="10">+ getItems(): List&lt;ItineraryItem&gt;</text>
  </g>

  <!-- Class 3: ItineraryItem -->
  <g transform="translate(680, 90)">
    <rect x="0" y="0" width="260" height="180" rx="6" fill="#FFFFFF" stroke="#123B5D" stroke-width="2" filter="url(#shadow)" />
    <rect x="0" y="0" width="260" height="30" rx="6" fill="#123B5D" />
    <text x="130" y="21" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">ItineraryItem</text>
    <text x="12" y="50" fill="#334155" font-size="10">- id: Long</text>
    <text x="12" y="66" fill="#334155" font-size="10">- itinerary: Itinerary</text>
    <text x="12" y="82" fill="#334155" font-size="10">- attraction: Attraction</text>
    <text x="12" y="98" fill="#334155" font-size="10">- visitOrder: Integer</text>
    <text x="12" y="114" fill="#334155" font-size="10">- arrivalTime: String</text>
    <text x="12" y="130" fill="#334155" font-size="10">- departureTime: String</text>
    <text x="12" y="146" fill="#334155" font-size="10">- isLunchBreak: Boolean</text>
    <line x1="0" y1="154" x2="260" y2="154" stroke="#CBD5E1" stroke-width="1" />
    <text x="12" y="170" fill="#0D9488" font-size="10">+ getAttraction(): Attraction</text>
  </g>

  <!-- Class 4: Category -->
  <g transform="translate(40, 320)">
    <rect x="0" y="0" width="220" height="140" rx="6" fill="#FFFFFF" stroke="#13B8A6" stroke-width="2" filter="url(#shadow)" />
    <rect x="0" y="0" width="220" height="30" rx="6" fill="#13B8A6" />
    <text x="110" y="21" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">Category</text>
    <text x="12" y="50" fill="#334155" font-size="10">- id: Long</text>
    <text x="12" y="66" fill="#334155" font-size="10">- name: String</text>
    <text x="12" y="82" fill="#334155" font-size="10">- icon: String</text>
    <text x="12" y="98" fill="#334155" font-size="10">- description: String</text>
    <line x1="0" y1="108" x2="220" y2="108" stroke="#CBD5E1" stroke-width="1" />
    <text x="12" y="126" fill="#0D9488" font-size="10">+ getName(): String</text>
  </g>

  <!-- Class 5: Attraction -->
  <g transform="translate(340, 320)">
    <rect x="0" y="0" width="250" height="210" rx="6" fill="#FFFFFF" stroke="#13B8A6" stroke-width="2" filter="url(#shadow)" />
    <rect x="0" y="0" width="250" height="30" rx="6" fill="#13B8A6" />
    <text x="125" y="21" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">Attraction</text>
    <text x="12" y="50" fill="#334155" font-size="10">- id: Long</text>
    <text x="12" y="66" fill="#334155" font-size="10">- name: String</text>
    <text x="12" y="82" fill="#334155" font-size="10">- category: Category</text>
    <text x="12" y="98" fill="#334155" font-size="10">- distanceKm: Double</text>
    <text x="12" y="114" fill="#334155" font-size="10">- durationMinutes: Integer</text>
    <text x="12" y="130" fill="#334155" font-size="10">- entranceFee: BigDecimal</text>
    <text x="12" y="146" fill="#334155" font-size="10">- latitude: Double</text>
    <text x="12" y="162" fill="#334155" font-size="10">- longitude: Double</text>
    <line x1="0" y1="172" x2="250" y2="172" stroke="#CBD5E1" stroke-width="1" />
    <text x="12" y="192" fill="#0D9488" font-size="10">+ getCategory(): Category</text>
  </g>

  <!-- Class 6: ContactMessage -->
  <g transform="translate(680, 320)">
    <rect x="0" y="0" width="260" height="150" rx="6" fill="#FFFFFF" stroke="#F59E42" stroke-width="2" filter="url(#shadow)" />
    <rect x="0" y="0" width="260" height="30" rx="6" fill="#F59E42" />
    <text x="130" y="21" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">ContactMessage</text>
    <text x="12" y="50" fill="#334155" font-size="10">- id: Long</text>
    <text x="12" y="66" fill="#334155" font-size="10">- name: String</text>
    <text x="12" y="82" fill="#334155" font-size="10">- email: String</text>
    <text x="12" y="98" fill="#334155" font-size="10">- message: String</text>
    <text x="12" y="114" fill="#334155" font-size="10">- isRead: Boolean</text>
    <line x1="0" y1="124" x2="260" y2="124" stroke="#CBD5E1" stroke-width="1" />
    <text x="12" y="140" fill="#0D9488" font-size="10">+ setIsRead(Boolean): void</text>
  </g>

  <!-- REST CONTROLLERS (Bottom Tier) -->
  <g transform="translate(40, 580)">
    <rect x="0" y="0" width="290" height="150" rx="6" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2" />
    <rect x="0" y="0" width="290" height="28" rx="6" fill="#3B82F6" />
    <text x="145" y="19" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">AttractionController</text>
    <text x="12" y="48" fill="#1E40AF" font-size="9.5">- attractionService: AttractionService</text>
    <line x1="0" y1="58" x2="290" y2="58" stroke="#BFDBFE" />
    <text x="12" y="76" fill="#1E3A8A" font-size="9.5">+ getAll(catId, q): ApiResponse</text>
    <text x="12" y="94" fill="#1E3A8A" font-size="9.5">+ getById(id): ApiResponse</text>
  </g>

  <g transform="translate(370, 580)">
    <rect x="0" y="0" width="310" height="150" rx="6" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2" />
    <rect x="0" y="0" width="310" height="28" rx="6" fill="#3B82F6" />
    <text x="155" y="19" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">ItineraryController</text>
    <text x="12" y="48" fill="#1E40AF" font-size="9.5">- itineraryService: ItineraryService</text>
    <line x1="0" y1="58" x2="310" y2="58" stroke="#BFDBFE" />
    <text x="12" y="76" fill="#1E3A8A" font-size="9.5">+ generate(req): ApiResponse</text>
    <text x="12" y="94" fill="#1E3A8A" font-size="9.5">+ save(dto): ApiResponse</text>
  </g>

  <g transform="translate(710, 580)">
    <rect x="0" y="0" width="300" height="150" rx="6" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2" />
    <rect x="0" y="0" width="300" height="28" rx="6" fill="#3B82F6" />
    <text x="150" y="19" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="700">AdminController</text>
    <text x="12" y="48" fill="#1E40AF" font-size="9.5">- attractionService: AttractionService</text>
    <line x1="0" y1="58" x2="300" y2="58" stroke="#BFDBFE" />
    <text x="12" y="76" fill="#1E3A8A" font-size="9.5">+ getDashboardStats(): ApiResponse</text>
    <text x="12" y="94" fill="#1E3A8A" font-size="9.5">+ createAttraction(dto): ApiResponse</text>
    <text x="12" y="112" fill="#1E3A8A" font-size="9.5">+ deleteAttraction(id): ApiResponse</text>
  </g>

  <!-- RELATIONSHIP LINES -->
  <!-- User 1 -> * Itinerary -->
  <line x1="260" y1="160" x2="340" y2="160" stroke="#123B5D" stroke-width="2" />
  <text x="270" y="152" fill="#123B5D" font-size="11" font-weight="700">1</text>
  <text x="325" y="152" fill="#123B5D" font-size="11" font-weight="700">*</text>

  <!-- Itinerary 1 *-- * ItineraryItem (Composition) -->
  <line x1="590" y1="160" x2="680" y2="160" stroke="#123B5D" stroke-width="2" />
  <polygon points="590,160 600,155 610,160 600,165" fill="#123B5D" />
  <text x="618" y="152" fill="#123B5D" font-size="11" font-weight="700">1</text>
  <text x="668" y="152" fill="#123B5D" font-size="11" font-weight="700">*</text>

  <!-- Category 1 -> * Attraction -->
  <line x1="260" y1="390" x2="340" y2="390" stroke="#13B8A6" stroke-width="2" />
  <text x="270" y="382" fill="#0D9488" font-size="11" font-weight="700">1</text>
  <text x="325" y="382" fill="#0D9488" font-size="11" font-weight="700">*</text>

  <!-- Attraction 1 <-- * ItineraryItem -->
  <line x1="590" y1="400" x2="680" y2="240" stroke="#123B5D" stroke-width="1.8" />
  <text x="600" y="415" fill="#123B5D" font-size="11" font-weight="700">1</text>
  <text x="685" y="235" fill="#123B5D" font-size="11" font-weight="700">*</text>
</svg>
"""

    with open(os.path.join(diagrams_dir, "class_diagram.svg"), "w", encoding="utf-8") as f:
        f.write(svg_class)

    # ========================================================
    # 5. ER / EER DIAGRAM SVG
    # ========================================================
    svg_erd = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 820" width="100%" height="100%" style="background:#F8FAFC; font-family:'Segoe UI', Inter, Arial, sans-serif;">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1" />
    </filter>
  </defs>

  <!-- Title Banner -->
  <rect x="20" y="15" width="1060" height="50" rx="8" fill="#123B5D" />
  <text x="550" y="46" text-anchor="middle" fill="#FFFFFF" font-size="18" font-weight="700">ER / EER Diagram — MySQL Relational Database Schema</text>

  <!-- Entity 1: USERS -->
  <g transform="translate(40, 90)">
    <rect x="0" y="0" width="220" height="190" rx="6" fill="#FFFFFF" stroke="#123B5D" stroke-width="2" filter="url(#shadow)" />
    <rect x="0" y="0" width="220" height="30" rx="6" fill="#123B5D" />
    <text x="110" y="21" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">USERS</text>
    <text x="12" y="52" fill="#B91C1C" font-size="10" font-weight="700">PK  id: BIGINT</text>
    <text x="12" y="74" fill="#1E293B" font-size="10">    full_name: VARCHAR(100)</text>
    <text x="12" y="96" fill="#1E293B" font-size="10">UK  email: VARCHAR(150)</text>
    <text x="12" y="118" fill="#1E293B" font-size="10">    password: VARCHAR(255)</text>
    <text x="12" y="140" fill="#1E293B" font-size="10">    role: VARCHAR(20)</text>
    <text x="12" y="162" fill="#64748B" font-size="10">    created_at: DATETIME</text>
  </g>

  <!-- Entity 2: ITINERARY -->
  <g transform="translate(370, 90)">
    <rect x="0" y="0" width="240" height="210" rx="6" fill="#FFFFFF" stroke="#123B5D" stroke-width="2" filter="url(#shadow)" />
    <rect x="0" y="0" width="240" height="30" rx="6" fill="#123B5D" />
    <text x="120" y="21" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">ITINERARY</text>
    <text x="12" y="52" fill="#B91C1C" font-size="10" font-weight="700">PK  id: BIGINT</text>
    <text x="12" y="74" fill="#0D9488" font-size="10" font-weight="700">FK  user_id: BIGINT</text>
    <text x="12" y="96" fill="#1E293B" font-size="10">    plan_name: VARCHAR(150)</text>
    <text x="12" y="118" fill="#1E293B" font-size="10">    visit_date: DATE</text>
    <text x="12" y="140" fill="#1E293B" font-size="10">    start_time: VARCHAR(10)</text>
    <text x="12" y="162" fill="#1E293B" font-size="10">    end_time: VARCHAR(10)</text>
    <text x="12" y="184" fill="#1E293B" font-size="10">    travel_mode: VARCHAR(20)</text>
  </g>

  <!-- Entity 3: ITINERARY_ITEMS -->
  <g transform="translate(730, 90)">
    <rect x="0" y="0" width="260" height="210" rx="6" fill="#FFFFFF" stroke="#123B5D" stroke-width="2" filter="url(#shadow)" />
    <rect x="0" y="0" width="260" height="30" rx="6" fill="#123B5D" />
    <text x="130" y="21" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">ITINERARY_ITEMS</text>
    <text x="12" y="52" fill="#B91C1C" font-size="10" font-weight="700">PK  id: BIGINT</text>
    <text x="12" y="74" fill="#0D9488" font-size="10" font-weight="700">FK  itinerary_id: BIGINT</text>
    <text x="12" y="96" fill="#0D9488" font-size="10" font-weight="700">FK  attraction_id: BIGINT</text>
    <text x="12" y="118" fill="#1E293B" font-size="10">    visit_order: INT</text>
    <text x="12" y="140" fill="#1E293B" font-size="10">    arrival_time: VARCHAR(10)</text>
    <text x="12" y="162" fill="#1E293B" font-size="10">    departure_time: VARCHAR(10)</text>
    <text x="12" y="184" fill="#1E293B" font-size="10">    is_lunch_break: BOOLEAN</text>
  </g>

  <!-- Entity 4: CATEGORIES -->
  <g transform="translate(40, 360)">
    <rect x="0" y="0" width="220" height="150" rx="6" fill="#FFFFFF" stroke="#13B8A6" stroke-width="2" filter="url(#shadow)" />
    <rect x="0" y="0" width="220" height="30" rx="6" fill="#13B8A6" />
    <text x="110" y="21" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">CATEGORIES</text>
    <text x="12" y="52" fill="#B91C1C" font-size="10" font-weight="700">PK  id: BIGINT</text>
    <text x="12" y="74" fill="#1E293B" font-size="10">UK  name: VARCHAR(100)</text>
    <text x="12" y="96" fill="#1E293B" font-size="10">    icon: VARCHAR(50)</text>
    <text x="12" y="118" fill="#1E293B" font-size="10">    description: TEXT</text>
  </g>

  <!-- Entity 5: ATTRACTIONS -->
  <g transform="translate(370, 360)">
    <rect x="0" y="0" width="240" height="230" rx="6" fill="#FFFFFF" stroke="#13B8A6" stroke-width="2" filter="url(#shadow)" />
    <rect x="0" y="0" width="240" height="30" rx="6" fill="#13B8A6" />
    <text x="120" y="21" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">ATTRACTIONS</text>
    <text x="12" y="52" fill="#B91C1C" font-size="10" font-weight="700">PK  id: BIGINT</text>
    <text x="12" y="74" fill="#1E293B" font-size="10">    name: VARCHAR(150)</text>
    <text x="12" y="96" fill="#0D9488" font-size="10" font-weight="700">FK  category_id: BIGINT</text>
    <text x="12" y="118" fill="#1E293B" font-size="10">    distance_km: DOUBLE</text>
    <text x="12" y="140" fill="#1E293B" font-size="10">    duration_minutes: INT</text>
    <text x="12" y="162" fill="#1E293B" font-size="10">    entrance_fee: DECIMAL(10,2)</text>
    <text x="12" y="184" fill="#1E293B" font-size="10">    latitude: DOUBLE</text>
    <text x="12" y="206" fill="#1E293B" font-size="10">    longitude: DOUBLE</text>
  </g>

  <!-- Entity 6: FAVORITES -->
  <g transform="translate(730, 360)">
    <rect x="0" y="0" width="260" height="130" rx="6" fill="#FFFFFF" stroke="#F59E42" stroke-width="2" filter="url(#shadow)" />
    <rect x="0" y="0" width="260" height="30" rx="6" fill="#F59E42" />
    <text x="130" y="21" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">FAVORITES</text>
    <text x="12" y="52" fill="#B91C1C" font-size="10" font-weight="700">PK  id: BIGINT</text>
    <text x="12" y="74" fill="#0D9488" font-size="10" font-weight="700">FK  user_id: BIGINT</text>
    <text x="12" y="96" fill="#0D9488" font-size="10" font-weight="700">FK  attraction_id: BIGINT</text>
    <text x="12" y="118" fill="#64748B" font-size="10">    created_at: DATETIME</text>
  </g>

  <!-- Entity 7: CONTACT_MESSAGES -->
  <g transform="translate(40, 630)">
    <rect x="0" y="0" width="220" height="150" rx="6" fill="#FFFFFF" stroke="#64748B" stroke-width="2" filter="url(#shadow)" />
    <rect x="0" y="0" width="220" height="30" rx="6" fill="#64748B" />
    <text x="110" y="21" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">CONTACT_MESSAGES</text>
    <text x="12" y="52" fill="#B91C1C" font-size="10" font-weight="700">PK  id: BIGINT</text>
    <text x="12" y="74" fill="#1E293B" font-size="10">    name: VARCHAR(100)</text>
    <text x="12" y="96" fill="#1E293B" font-size="10">    email: VARCHAR(150)</text>
    <text x="12" y="118" fill="#1E293B" font-size="10">    message: TEXT</text>
    <text x="12" y="140" fill="#1E293B" font-size="10">    is_read: BOOLEAN</text>
  </g>

  <!-- Entity 8: REVIEWS -->
  <g transform="translate(370, 630)">
    <rect x="0" y="0" width="240" height="150" rx="6" fill="#FFFFFF" stroke="#F59E42" stroke-width="2" filter="url(#shadow)" />
    <rect x="0" y="0" width="240" height="30" rx="6" fill="#F59E42" />
    <text x="120" y="21" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="700">REVIEWS</text>
    <text x="12" y="52" fill="#B91C1C" font-size="10" font-weight="700">PK  id: BIGINT</text>
    <text x="12" y="74" fill="#0D9488" font-size="10" font-weight="700">FK  user_id: BIGINT</text>
    <text x="12" y="96" fill="#0D9488" font-size="10" font-weight="700">FK  attraction_id: BIGINT</text>
    <text x="12" y="118" fill="#1E293B" font-size="10">    rating: INT (1-5)</text>
    <text x="12" y="140" fill="#1E293B" font-size="10">    comment: TEXT</text>
  </g>

  <!-- RELATIONSHIP CONNECTORS -->
  <!-- USERS to ITINERARY (1 to M) -->
  <line x1="260" y1="170" x2="370" y2="170" stroke="#123B5D" stroke-width="2" />
  <circle cx="265" cy="170" r="3" fill="#123B5D" />
  <!-- Crow's foot at 370 -->
  <line x1="360" y1="165" x2="370" y2="170" stroke="#123B5D" stroke-width="2" />
  <line x1="360" y1="175" x2="370" y2="170" stroke="#123B5D" stroke-width="2" />

  <!-- ITINERARY to ITINERARY_ITEMS (1 to M) -->
  <line x1="610" y1="170" x2="730" y2="170" stroke="#123B5D" stroke-width="2" />
  <circle cx="615" cy="170" r="3" fill="#123B5D" />
  <!-- Crow's foot at 730 -->
  <line x1="720" y1="165" x2="730" y2="170" stroke="#123B5D" stroke-width="2" />
  <line x1="720" y1="175" x2="730" y2="170" stroke="#123B5D" stroke-width="2" />

  <!-- CATEGORIES to ATTRACTIONS (1 to M) -->
  <line x1="260" y1="435" x2="370" y2="435" stroke="#13B8A6" stroke-width="2" />
  <circle cx="265" cy="435" r="3" fill="#13B8A6" />
  <!-- Crow's foot at 370 -->
  <line x1="360" y1="430" x2="370" y2="435" stroke="#13B8A6" stroke-width="2" />
  <line x1="360" y1="440" x2="370" y2="435" stroke="#13B8A6" stroke-width="2" />

  <!-- ATTRACTIONS to ITINERARY_ITEMS (1 to M) -->
  <line x1="610" y1="400" x2="730" y2="240" stroke="#123B5D" stroke-width="1.8" />
</svg>
"""

    with open(os.path.join(diagrams_dir, "er_diagram.svg"), "w", encoding="utf-8") as f:
        f.write(svg_erd)

    print("All 5 SVG diagrams successfully generated in docs/diagrams/")

if __name__ == "__main__":
    create_svg_diagrams()

import { useState } from 'react'

const artWidth = 1200
const artHeight = 660

function Diagram({ children, className = '', label, source, viewBox = `0 0 ${artWidth} ${artHeight}` }) {
  return (
    <svg className={`diagram ${className}${source ? ' art-desktop' : ''}`} viewBox={viewBox} role={label ? 'img' : undefined}
      aria-label={label} aria-hidden={label ? undefined : true}>
      {source ? <g id={source}>{children}</g> : children}
    </svg>
  )
}

function Bed({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="66" height="85" />
      <rect x="4" y="5" width="27" height="18" />
      <rect x="35" y="5" width="27" height="18" />
      <path d="M4 28h58v52H4zM-17 4h13v17h-13zM70 4h13v17H70z" />
      <circle cx="-10" cy="12" r="3" />
      <circle cx="77" cy="12" r="3" />
    </g>
  )
}

function FloorPlan({ x = 0, y = 0 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="fine">
        <path d="M184 8H19v168H0v82h190m38 0h257V8H226M184 14H25v167H6v71h184m38 0h251V14H226M25 135h140v32m-140-27h135v27m5 37v48m-5-48v48M333 14v88m-5-88v88m0 39h151m-145 4h145m-145 0v78h-6v-82m6 55h28v5h-28m132-56v56h-70v-5h65v-51" />
        <path d="M12 234h132v-55H12zm0-27h132m-94-28v55m44-55v55m-74-48h25v17H20zm91 0h25v17h-25z" />
        {[0, 1, 2, 3].map((n) => <circle key={n} cx={62 + (n % 2) * 17} cy={186 + (n > 1 ? 12 : 0)} r="3.6" />)}
        <Bed x={44} y={37} />
        <Bed x={367} y={37} />
        <rect x="208" y="42" width="92" height="32" rx="2" />
        <path d="M211 46h86v24h-86zM211 51h86m-58 0v19m29-19v19M194 41h-9v81h9z" />
        <rect x="226" y="91" width="54" height="29" rx="14" />
        <rect x="292" y="97" width="16" height="16" />
        <rect x="400" y="208" width="64" height="33" rx="4" />
        <rect x="406" y="213" width="52" height="23" rx="3" />
        <path d="M346 150h48v13h-48zM416 151h40v34h-40zM416 185l40-34m-92 66h16v14a8 8 0 0 1-16 0z" />
        <path d="M45 8v6m58-6v6m206-6v6m65-6v6M45 252v6m58-6v6m206-6v6m65-6v6" />
      </g>
      <text x="0" y="271">UNIT 03</text><text x="62" y="271">OCCUPIED</text>
      <text x="485" y="271" textAnchor="end">2 BED / 1 BATH</text>
    </g>
  )
}

function Wall({ x, damage = false }) {
  return (
    <g transform={`translate(${x} 70)`}>
      <g className="fine">
        <path d="M0 6l111 33v95L0 101zM-5 13l126 36m-126-41 126 36m-126 54 126 37M12 18l40 12v83l-40-12zM17 24l30 9v74l-30-9zM22 30l20 6v63l-20-6zM64 27v94m27-86v96m-90-80 110 35m-110-9 110 35" />
        {damage && <path className="damage" d="m82 40-6 16 8 13-11 15 8 11-6 13m9-39 13 8 8 13" />}
      </g>
      <text x="5" y="154">{damage ? 'MOVE OUT' : 'MOVE IN'}</text>
    </g>
  )
}

function Eigna() {
  const [us, setUs] = useState(false)
  const money = us ? ['$1,200', '$180', '$48', '$972'] : ['₹32,000', '₹4,800', '₹1,250', '₹25,950']
  return (
    <>
      <Diagram className="art-back" source="eigna-back" label="A rental unit, its signed lease, and before-and-after inspection drawings">
        <FloorPlan x={44} y={26} />
        <g className="art-step" transform="translate(580 83) rotate(-9)">
          <rect className="sheet" width="172" height="177" />
          <text x="17" y="22">LEASE AGREEMENT</text>
          <text x="17" y="37" className="art-muted">RESIDENTIAL</text><text x="128" y="37" className="art-muted">UNIT 03</text>
          <path className="fine" d="M16 46h140M16 115h140M16 154h88" />
          <text x="17" y="68" className="art-muted">MONTHLY RENT</text>
          <text x="17" y="89" className="art-value">{money[0]}</text>
          <text x="17" y="106">TENANT / 01</text><text x="123" y="106">ACTIVE</text>
          <text x="16" y="130" className="art-muted">TENANT SIGNATURE</text>
          <path className="fine" d="M16 153q22-25 22-17t-13 19q25-33 16-10t5-6q6-9 3 1t17-3" />
          <circle className="fine" cx="148" cy="151" r="9" /><path className="fine" d="m144 151 3 3 5-6" />
        </g>
        <Wall x={821} /><Wall x={990} damage />
      </Diagram>
      <Diagram className="art-front" source="eigna-front" label="A repair wrench connects the inspection to the expense ledger">
        <g transform="translate(95 502) rotate(-7)" className="art-step">
          <path className="sheet" d="M75 8C42 10 29 36 40 59L3 105l20 16 42-47C91 74 111 52 101 26L82 52l-20-4-9-15Z" />
          <path className="fine" d="m44 48 14 12 27 3 16-21M23 99l30-35" />
          <text x="34" y="139">WALL REPAIR / COMPLETE</text>
        </g>
      </Diagram>
      <div className="ledger art-front">
        <div className="ledger-page">
          <span>APR / UNIT 03</span>
          <dl>{['RENT', 'WALL REPAIR', 'OTHER EXPENSES', 'NET'].map((label, i) => (
            <div key={label} className="art-step"><dt>{label}</dt><dd>{money[i]}</dd></div>
          ))}</dl>
        </div>
        <div className="ledger-page">
          <div className="ledger-heading">
            <span>TAX / FY26</span>
            <div role="group" aria-label="Property jurisdiction">
              <button type="button" data-cursor="go" aria-pressed={!us} onClick={() => setUs(false)}>INDIA</button>
              <span aria-hidden="true"> / </span>
              <button type="button" data-cursor="go" aria-pressed={us} onClick={() => setUs(true)}>US</button>
            </div>
          </div>
          <p className="art-step" aria-live="polite">{us ? 'FORM 1040 / SCHEDULE E' : 'ITR / SCHEDULE HP'}</p>
          <p className="art-step">NET RENTAL INCOME <strong>{money[3]}</strong></p>
        </div>
      </div>
    </>
  )
}

const orbitTools = [['MAIL', 'Re: Project direction', 138, 161, -4], ['WEB SEARCH', 'Latest project update', 197, 445, -5], ['WRITING', 'Response draft', 925, 167, 4], ['FINANCE', 'Project spend', 879, 437, 5]]

function Orbit() {
  return (
    <>
      <Diagram className="art-back" source="orbit-back" label="Four connected tools revolve around a single request">
        <ellipse cx="600" cy="364" rx="505" ry="218" className="orbit-ring" transform="rotate(-12 600 364)" />
        <ellipse cx="600" cy="364" rx="489" ry="242" className="orbit-ring orbit-ring-alt" transform="rotate(13 600 364)" />
      </Diagram>
      <Diagram className="art-front" source="orbit-front" label="An Orbit conversation gathers context and prepares a response for review">
        {orbitTools.map(([label, value, x, y, angle]) => (
          <g key={label} transform={`translate(${x} ${y}) rotate(${angle})`}>
            <g className="art-step">
              <rect width="160" height="139" className="sheet" />
              <text x="14" y="23">{label}</text>
              <path d="M14 33h130m-130 80h130" className="fine" />
              <text x="14" y="53" className="art-strong">{value}</text>
              <text x="14" y="77" className="art-muted">LATEST PROJECT UPDATE</text>
              <text x="14" y="92" className="art-muted">CONTEXT READY</text>
              <text x="14" y="127">REVIEWED</text>
            </g>
          </g>
        ))}
        <g transform="translate(341 228)">
          <rect width="518" height="339" className="inverted" rx="4" />
          <g className="inverted-text">
            <text x="22" y="34" className="art-brand">ORBIT</text>
            <text x="496" y="33" textAnchor="end">One conversation. Every tool within reach.</text>
            <path d="M22 51h474M22 148h474M22 235h474M22 310h474" className="fine" />
            <g className="art-step">
              <circle cx="41" cy="99" r="19" className="inverted-dot" /><text x="41" y="103" textAnchor="middle" className="inverted-icon">◎</text>
              <text x="89" y="82" className="art-value"><tspan x="89">Find the latest project update,</tspan><tspan x="89" dy="22">analyze the financials, and draft</tspan><tspan x="89" dy="22">a response to Alex.</tspan></text>
            </g>
            <g className="art-step">
              <circle cx="41" cy="192" r="19" className="inverted-dot" /><text x="41" y="196" textAnchor="middle" className="inverted-icon">⌕</text>
              <text x="89" y="186" className="art-value">Working across connected tools…</text>
              <text x="89" y="209">SEARCH · FINANCE · WRITING · MAIL</text>
            </g>
            <g className="art-step">
              <circle cx="41" cy="273" r="19" className="inverted-dot" /><text x="41" y="277" textAnchor="middle" className="inverted-icon">✓</text>
              <text x="89" y="271" className="art-value">Response drafted</text>
              <text x="89" y="292">ANALYSIS INCLUDED · READY FOR REVIEW</text>
              <rect x="358" y="257" width="133" height="39" className="fine" rx="3" />
              <text x="425" y="281" textAnchor="middle">Review &amp; Send →</text>
            </g>
          </g>
        </g>
      </Diagram>
    </>
  )
}

function Receipt({ x, y, title, name, number, angle = 0, rejected = false }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect width="224" height="270" className="paper" />
      <g className="paper-text">
        <text x="16" y="25">{name}</text>
        <text x="16" y="56" className="art-brand">{title}</text>
        <path d="M16 68h192m-192 36h192m-192 30h192m-192 22h192m-192 22h192m-192 22h192m-192 22h192M16 104v118m84-118v118m36-118v118m37-118v118m35-118v118" className="fine" />
        <text x="16" y="91">{number}</text><text x="24" y="122">DESCRIPTION</text>
        <text x="106" y="122">QTY</text><text x="142" y="122">UNIT</text><text x="176" y="122">AMOUNT</text>
        {[144, 166, 188, 210].map((line, i) => <path className="fine" key={line} d={`M25 ${line}h${45 - i * 3}m38 0h12m23 0h12m23 0h18`} />)}
        <text x="18" y="249" className={rejected ? 'ink-red' : ''}>{rejected ? 'REJECTED / CHECK DOCUMENT' : 'TOTAL   1,280.00'}</text>
      </g>
    </g>
  )
}

function Meal() {
  return (
    <>
      <Diagram className="art-back" source="mealops-back" label="An architectural drawing of a plate and fork">
        <g transform="translate(252 259)">
          {[192, 185, 177, 149, 141, 124, 116].map((radius) => <circle key={radius} r={radius} className="fine" />)}
          <path d="M-207 0h414M0-207v414m-152-152 304 304m0-304-304 304" className="fine orbit-ring" />
          <path d="M-103 39q40 58 103 51t98-67q-48-74-102-64t-99 80Z" className="fine" />
          {Array.from({ length: 24 }, (_, i) => (
            <path className="fine" key={i} d="M-16 20q15-26 42-17l13 24-28 20z" transform={`rotate(${i * 31}) translate(${23 + (i % 6) * 8} ${(i % 5) * 9 - 30}) scale(.35)`} />
          ))}
        </g>
        <g transform="translate(82 282) rotate(4)">
          <path className="fine" d="M-15 0v73q0 18 12 25v251q0 23 14 23t14-23V97q13-7 13-24V0h-6v65q0 8-5 8t-5-8V0h-6v65q0 8-5 8t-5-8V0H0v65q0 8-5 8t-5-8V0Z" />
        </g>
      </Diagram>
      <Diagram className="art-front" source="mealops-front" label="The meal order moves from chat through the company wallet to delivery">
        <g className="art-step" transform="translate(589 118)">
          <rect width="357" height="70" rx="9" className="sheet" />
          <text x="20" y="22">TEAMS / SLACK</text>
          <text x="20" y="46" className="art-value">Order a rice bowl from Bowlstory.</text>
        </g>
        <g className="art-step" transform="translate(680 207)">
          <rect width="408" height="78" rx="9" className="sheet" />
          <text x="20" y="25">MEALOPS</text><text x="20" y="50" className="art-value">Order placed. Your rice bowl is on its way.</text>
        </g>
        <g transform="translate(320 384) rotate(6)"><g className="art-step"><Receipt x={0} y={0} title="ORDER" name="BOWLSTORY" number="RICE BOWL / ₹240" /></g></g>
        <g className="art-step" transform="translate(585 451)">
          <path className="fine" d="M0 0h238v97H0zm0 27h238" />
          <text x="15" y="18">COMPANY WALLET</text><text x="15" y="58" className="art-value">₹49,760</text>
          <text x="15" y="78">BALANCE</text><text x="220" y="58" textAnchor="end" className="ink-red">−₹240</text>
        </g>
        <g transform="translate(924 383) rotate(7)">
          <g className="art-step">
            <path className="sheet" d="M0 58h171l12 174H-12z" /><path className="fine" d="M50 84V41a34 34 0 0 1 68 0v43M-4 223h179" />
            {[13, 19, 27].map((radius) => <circle key={radius} cx="85" cy="128" r={radius} className="fine" />)}
            <text x="85" y="179" textAnchor="middle">ON THE WAY</text><text x="85" y="199" textAnchor="middle">ARRIVES AT 12:45</text>
          </g>
        </g>
      </Diagram>
    </>
  )
}

function Papertrail() {
  return (
    <>
      <Diagram className="art-back" source="papertrail-back" label="A document scanner reads and verifies an invoice">
        <g opacity=".25" transform="translate(668 15) rotate(4)">
          <rect className="fine" width="508" height="501" />
          <path className="fine" d="M0 58h508m-508 34h508m-508 54h508m-508 45h508" />
          <text x="20" y="38" className="art-value">INVOICE</text>
        </g>
        <path className="orbit-ring" d="M0 454h1200" />
      </Diagram>
      <Diagram className="art-front" source="papertrail-front" label="Four paper invoices move through a scan with the verified invoice in front">
        <g opacity=".65"><Receipt x={-34} y={313} title="INVOICE" name="ACME SUPPLY" number="INV-1038" angle={-18} /></g>
        <g opacity=".86"><Receipt x={134} y={329} title="INVOICE" name="RIVER & CO." number="INV-1040" angle={-6} /></g>
        <g transform="translate(388 228) scale(1.47)">
          <Receipt x={0} y={0} title="INVOICE" name="NORTHRIDGE" number="INV-1042" angle={11} />
        </g>
        <g opacity=".55"><Receipt x={966} y={310} title="INVOICE" name="HARBOR LTD." number="INV-1051" angle={-8} rejected /></g>
        <g className="art-step">
          <path className="scan-line" d="M280 391h503" />
          <text x="792" y="395" className="ink-red">VERIFIED / 01</text>
        </g>
      </Diagram>
    </>
  )
}

function Waveform({ x, y, width, count = 47 }) {
  return (
    <g className="fine" transform={`translate(${x} ${y})`}>
      {Array.from({ length: count }, (_, i) => {
        const height = 4 + Math.abs(Math.sin(i * 7) * Math.cos(i * .33)) * 46
        const barX = i * (width / count)
        return <path key={i} d={`M${barX} ${-height / 2}v${height}`} />
      })}
    </g>
  )
}

function Scribe() {
  return (
    <>
      <Diagram className="art-back" source="scribe-back" label="A recording waveform and an analysis of the meeting">
        <g transform="translate(87 66) rotate(-4)">
          <rect width="366" height="148" className="sheet" rx="4" />
          <text x="19" y="27">RECORDING / KICKOFF.MP4</text>
          <Waveform x={27} y={81} width={312} />
          <path d="M19 119h328" className="fine" />
          <text x="19" y="136">▶  04:28 / 24:16</text>
        </g>
        <g className="art-step" transform="translate(790 105) rotate(5)">
          <rect width="259" height="158" className="sheet" />
          <text x="20" y="25">MEETING ANALYSIS</text>
          <path className="fine" d="M20 38h218" />
          <text x="20" y="62">01  GOALS</text><text x="20" y="94">02  OWNERS</text><text x="20" y="126">03  DECISIONS</text>
          <circle cx="223" cy="58" r="4" className="ink-red" />
        </g>
      </Diagram>
      <Diagram className="art-front" source="scribe-front" label="A generated project charter and its revised approval step">
        <g transform="translate(373 418) rotate(-4)">
          <path className="sheet" d="M0 0h289l50 50v177H0zm289 0v50h50" />
          <text x="23" y="29">PROJECT CHARTER / VERSION 02</text>
          <text x="23" y="69" className="art-brand">Launch planning.</text>
          <path className="fine" d="M23 87h280m-280 29h280m-280 36h280m-280 36h280" />
          <text x="23" y="106">GOAL / SCOPE THE FIRST RELEASE</text>
          <text x="23" y="140">OWNERS / PRODUCT + ENGINEERING</text>
          <text x="23" y="176">DECISIONS / PILOT BEFORE ROLLOUT</text>
          <text x="23" y="212" className="ink-red art-step">REVISION / ADD AN APPROVAL STEP</text>
        </g>
        <g className="art-step" transform="translate(807 468)">
          <rect width="259" height="56" className="sheet" rx="3" /><text x="16" y="33">Add an approval step.</text>
        </g>
        <g className="art-step" transform="translate(854 533)">
          <rect width="259" height="56" className="sheet" rx="3" /><text x="16" y="33">Updated in version 2. ✓</text>
        </g>
      </Diagram>
    </>
  )
}

function LendingRecord({ x, y, title, detail, angle, rows = 4 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect className="sheet" width="235" height={76 + rows * 18} rx="3" />
      <text x="16" y="25" className="art-strong">{title}</text>
      <text x="16" y="46" className="art-muted">{detail}</text>
      {Array.from({ length: rows }, (_, i) => (
        <path className="fine" key={i} d={`M16 ${66 + i * 18}h${i % 2 ? 123 : 193}`} />
      ))}
    </g>
  )
}

function Crediflow() {
  return (
    <>
      <Diagram className="art-back" source="crediflow-back" label="Submitted identity, business tax records and financial assessment">
        <LendingRecord x={147} y={86} title="PAN IDENTITY" detail="PERMANENT ACCOUNT NUMBER" angle={-9} rows={2} />
        <LendingRecord x={424} y={55} title="GST RETURN" detail="FILING PERIOD / FY25–26" angle={4} />
        <LendingRecord x={915} y={413} title="BANK STATEMENT" detail="BUSINESS ACCOUNT / 6 MONTHS" angle={8} />
        <LendingRecord x={88} y={436} title="INCOME TAX RETURNS" detail="THREE YEARS / VERIFIED" angle={-8} />
      </Diagram>
      <Diagram className="art-front" source="crediflow-front" label="Business lending progress from application to disbursement">
        <g transform="translate(701 143)" className="art-step">
          <rect className="sheet" width="396" height="145" />
          <text x="16" y="26">FINANCIAL ASSESSMENT</text>
          <path d="M16 41h363M104 41v86m94-86v86m94-86v86" className="fine" />
          {['TURNOVER', 'PROFIT', 'CASH FLOW', 'CREDIT'].map((label, i) => (
            <g key={label} transform={`translate(${16 + i * 94} 0)`}>
              <text y="65">{label}</text>
              <text y="97" className="art-value" data-count={['48', '8', '12', '742'][i]} data-suffix={i < 3 ? 'L' : ''}>{['48L', '8L', '12L', '742'][i]}</text>
              <text y="123" className="art-muted">{['ANNUAL', 'ANNUAL', '6 MONTHS', 'BUREAU'][i]}</text>
            </g>
          ))}
        </g>
        <g transform="translate(380 510)" className="art-step">
          <rect width="442" height="113" className="sheet" />
          <text x="20" y="25">ELIGIBILITY / UP TO</text>
          <text x="20" y="68" className="art-value">₹<tspan data-count="18" data-suffix="L">18L</tspan></text>
          <text x="179" y="40">✓ DOCUMENTS VERIFIED</text>
          <text x="179" y="63">✓ SANCTION APPROVED</text>
          <text x="179" y="86" className="ink-red">→ TRANSFER QUEUED</text>
        </g>
      </Diagram>
    </>
  )
}

const scenes = { eigna: Eigna, orbit: Orbit, mealops: Meal, papertrail: Papertrail, scribe: Scribe, crediflow: Crediflow }

// Reframe the same drawings into portrait compositions. Each entry pairs a source crop with its frame.
const phoneCompositions = {
  eigna: [1239, [
    ['back', '40 25 495 277', [22, 234, 348, 199]],
    ['back', '574 49 210 220', [16, 456, 132, 144]],
    ['back', '802 62 340 180', [172, 465, 200, 124]],
    ['front', '89 483 152 147', [26, 763, 164, 154]],
  ]],
  orbit: [1072, [
    ['back', '72 99 1056 540', [1, 255, 388, 499]],
    ['front', '135 145 175 166', [20, 340, 141, 142]],
    ['front', '910 164 190 163', [184, 270, 204, 185]],
    ['front', '340 226 520 342', [26, 501, 338, 225]],
    ['front', '183 426 190 163', [30, 756, 147, 135]],
    ['front', '869 424 192 173', [202, 739, 152, 139]],
  ]],
  mealops: [1030, [
    ['back', '40 50 423 607', [16, 172, 271, 438]],
    ['front', '586 116 360 74', [169, 209, 198, 48]],
    ['front', '673 201 423 89', [40, 287, 259, 66]],
    ['front', '579 446 252 111', [49, 381, 310, 76]],
    ['front', '286 373 263 294', [48, 524, 151, 174]],
    ['front', '882 371 230 289', [225, 670, 137, 177]],
  ]],
  papertrail: [1030, [
    ['back', '663 10 567 536', [13, 55, 353, 316]],
    ['front', '-10 291 375 329', [-65, 330, 284, 251]],
    ['front', '344 222 404 465', [61, 284, 318, 360]],
    ['front', '941 267 252 350', [194, 630, 176, 245]],
  ]],
  scribe: [1152, [
    ['back', '82 35 398 188', [26, 220, 320, 139]],
    ['back', '781 98 289 191', [134, 361, 229, 134]],
    ['front', '364 390 374 261', [39, 555, 288, 259]],
    ['front', '791 460 342 143', [85, 850, 291, 127]],
  ]],
  crediflow: [1030, [
    ['back', '139 45 530 181', [25, 181, 341, 166]],
    ['front', '699 141 400 149', [23, 335, 344, 119]],
    ['back', '78 406 275 195', [170, 557, 201, 144]],
    ['back', '902 397 285 209', [20, 658, 244, 181]],
    ['front', '378 509 448 121', [20, 851, 326, 90]],
  ]],
}

export function ProjectArt({ project }) {
  const Scene = scenes[project.slug]
  const [height, crops] = phoneCompositions[project.slug]
  return (
    <>
      <Scene />
      <svg className="diagram art-phone" viewBox={`0 0 390 ${height}`} preserveAspectRatio="none" role="img" aria-label={project.description}>
        {crops.map(([layer, viewBox, [x, y, width, cropHeight]]) => (
          <svg key={viewBox} x={x} y={y} width={width} height={cropHeight} viewBox={viewBox} overflow="hidden">
            <use href={`#${project.slug}-${layer}`} />
          </svg>
        ))}
      </svg>
    </>
  )
}

export function StudyArt({ project }) {
  if (project.slug === 'eigna') {
    return (
      <figure className="study-art property-map">
        <Diagram label="A floor plan of the rental property" viewBox="-10 0 512 281"><FloorPlan x={0} y={0} /></Diagram>
        <figcaption><small>PROPERTY RECORD</small><strong>One property.<br />Every operation.</strong><span>TENANT / LEASE / INSPECTION<br />RENT / MAINTENANCE / FINANCIALS</span></figcaption>
      </figure>
    )
  }
  if (project.slug === 'orbit') {
    return (
      <figure className="study-art">
        <Diagram label="One request connects mail, search, writing and finance" viewBox="0 0 920 380">
          <ellipse className="fine" cx="460" cy="190" rx="354" ry="137" />
          <ellipse className="orbit-ring" cx="460" cy="190" rx="300" ry="155" transform="rotate(-19 460 190)" />
          <path className="fine" d="m136 88 324 102 324-102M136 291l324-101 324 101" />
          {[[64, 58, 'MAIL'], [655, 58, 'SEARCH'], [64, 263, 'WRITING'], [655, 263, 'FINANCE / DATA']].map(([x, y, label]) => (
            <g key={label} transform={`translate(${x} ${y})`}><rect className="sheet" width="200" height="53" /><text x="100" y="32" textAnchor="middle">{label}</text></g>
          ))}
          <circle className="sheet" cx="460" cy="190" r="65" /><circle className="ink-red" cx="460" cy="125" r="4" />
          <text x="460" y="187" className="art-strong" textAnchor="middle">ONE REQUEST</text><text x="460" y="207" textAnchor="middle">INTENT → ACTION</text>
        </Diagram>
      </figure>
    )
  }
  return (
    <figure className="study-art">
      <Diagram label={`${project.name} product map`} viewBox="0 0 1080 356">
        <path className="diagram-link" d="M118 174h843" /><circle className="ink-red" cx="536" cy="174" r="4" />
        <g transform="translate(99 63)">
          <rect x="14" y="-14" width="223" height="217" className="sheet" /><rect x="7" y="-7" width="223" height="217" className="sheet" />
          <rect width="223" height="217" className="sheet" /><text x="19" y="37">{project.steps[0].toUpperCase()}</text>
          {project.slug === 'scribe' ? <Waveform x={19} y={104} width={177} /> : <text x="19" y="108" className="art-brand">{project.steps[0]}</text>}
          <path d="M19 145h178m-178 18h144m-144 18h155" className="fine" />
        </g>
        <g transform="translate(408 88)">
          <rect width="250" height="230" className="sheet" /><text x="20" y="34">STRUCTURED WORKFLOW</text>
          {project.steps.slice(1, 5).map((step, i) => <g key={step} transform={`translate(20 ${65 + i * 40})`}><path d="M0 0h209" className="fine" /><text y="24">0{i + 1} / {step.toUpperCase()}</text></g>)}
        </g>
        <g transform="translate(752 45)">
          <path className="sheet" d="M0 0h184l44 44v225H0zm184 0v44h44" /><text x="20" y="66">{project.steps.at(-1).toUpperCase()}</text>
          <path d="M20 110h185m-185 22h169m-169 22h182m-182 22h148m-148 22h182" className="fine" />
          <text x="20" y="246" className="ink-red">READY / ✓</text>
        </g>
      </Diagram>
    </figure>
  )
}

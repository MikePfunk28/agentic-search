Browsing Topics API removed from http://localhost:3000/ which is main frame
webcomponents-ce.js:33 Uncaught Error: A custom element with name 'mce-autosize-textarea' has already been defined.
    at Aa (webcomponents-ce.js:33:363)
    at m.define (webcomponents-ce.js:33:133)
    at overlay_bundle.js:149:5562
    at C (overlay_bundle.js:45:682)
    at overlay_bundle.js:160:392Understand this error
filler.17f3ba95.js:9 checkSupportDomain domain: localhost
model-config.ts:270 [ModelConfig] Initialized with default Ollama configuration (model auto-detected from client)
installHook.js:1 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Wrap>
      <Provider queryClient={{}}>
        <QueryClientProvider client={{}}>
          <Matches>
            <SafeFragment fallback={null}>
              <Transitioner>
              <MatchesInner>
                <CatchBoundary getResetKey={function getResetKey} errorComponent={function ErrorComponent} ...>
                  <CatchBoundaryImpl getResetKey={function getResetKey} onCatch={function onCatch}>
                    <MatchImpl matchId="__root__">
                      <RootDocument>
                        <html lang="en">
                          <head>
                          <body
-                           cz-shortcut-listen="true"
                          >

overrideMethod @ installHook.js:1Understand this error
model-detection.ts:42 [ModelDetection] Checking Ollama at http://localhost:11434
model-detection.ts:69 [ModelDetection] Failed to detect Ollama models: signal timed out
model-detection.ts:79 [ModelDetection] Checking LM Studio at http://localhost:1234
model-detection.ts:104 [ModelDetection] Failed to detect LM Studio models: signal timed out
__root.tsx:85 [App] Active provider: custom-1772899526871 | Active model: glm-5
__root.tsx:86 [Security] API keys are stored securely in Convex, not in browser localStorage
model-detection.ts:81 Fetch failed loading: GET "http://localhost:1234/v1/models".
detectLMStudioModels @ model-detection.ts:81
detectAndUpdateLocalModels @ model-store.ts:426
(index):1 Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was receivedUnderstand this error
(index):1 Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was receivedUnderstand this error
(index):1 Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was receivedUnderstand this error
(index):1 Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was receivedUnderstand this error
(index):1 Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was receivedUnderstand this error
useCsrfToken.tsx:11 Fetch finished loading: GET "http://localhost:3000/api/csrf-token".
(anonymous) @ useCsrfToken.tsx:11
requestCsrfToken @ useCsrfToken.tsx:21
(anonymous) @ useCsrfToken.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
useSearchProgress.ts:129 Fetch finished loading: GET "http://localhost:3000/api/csrf-token".
(anonymous) @ useSearchProgress.ts:129
handleSubmit @ AgenticChat.tsx:351
onKeyDown @ AgenticChat.tsx:787
executeDispatch @ react-dom-client.development.js:19116
runWithFiberInDEV @ react-dom-client.development.js:871
processDispatchQueue @ react-dom-client.development.js:19166
(anonymous) @ react-dom-client.development.js:19767
batchedUpdates$1 @ react-dom-client.development.js:3255
dispatchEventForPluginEventSystem @ react-dom-client.development.js:19320
dispatchEvent @ react-dom-client.development.js:23585
dispatchDiscreteEvent @ react-dom-client.development.js:23553
<textarea>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
AgenticChat @ AgenticChat.tsx:762
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
EventSource finished loading: GET "http://localhost:3000/api/search/progress?searchId=search-1772909329565&token=6a816920af1745748eb8befffb9df1fb2d10e9686a704b24bbf03ff511ab1aa2".
useSearchProgress.ts:184 Fetch finished loading: POST "http://localhost:3000/api/search/stream".
(anonymous) @ useSearchProgress.ts:184
await in (anonymous)
handleSubmit @ AgenticChat.tsx:351
onKeyDown @ AgenticChat.tsx:787
executeDispatch @ react-dom-client.development.js:19116
runWithFiberInDEV @ react-dom-client.development.js:871
processDispatchQueue @ react-dom-client.development.js:19166
(anonymous) @ react-dom-client.development.js:19767
batchedUpdates$1 @ react-dom-client.development.js:3255
dispatchEventForPluginEventSystem @ react-dom-client.development.js:19320
dispatchEvent @ react-dom-client.development.js:23585
dispatchDiscreteEvent @ react-dom-client.development.js:23553
<textarea>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
AgenticChat @ AgenticChat.tsx:762
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
EventSource finished loading: GET "http://localhost:3000/api/search/progress?searchId=search-1772909329565&token=6a816920af1745748eb8befffb9df1fb2d10e9686a704b24bbf03ff511ab1aa2".
EventSource finished loading: GET "http://localhost:3000/api/search/progress?searchId=search-1772909329565&token=6a816920af1745748eb8befffb9df1fb2d10e9686a704b24bbf03ff511ab1aa2".
EventSource finished loading: GET "http://localhost:3000/api/search/progress?searchId=search-1772909329565&token=6a816920af1745748eb8befffb9df1fb2d10e9686a704b24bbf03ff511ab1aa2".
client:865 [vite] server connection lost. Polling for restart...
Navigated to http://localhost:3000/
injection-topics.js:1 Browsing Topics API removed from http://localhost:3000/ which is main frame
webcomponents-ce.js:33 Uncaught Error: A custom element with name 'mce-autosize-textarea' has already been defined.
    at Aa (webcomponents-ce.js:33:363)
    at m.define (webcomponents-ce.js:33:133)
    at overlay_bundle.js:149:5562
    at C (overlay_bundle.js:45:682)
    at overlay_bundle.js:160:392
Aa @ webcomponents-ce.js:33
m.define @ webcomponents-ce.js:33
(anonymous) @ overlay_bundle.js:149
C @ overlay_bundle.js:45
(anonymous) @ overlay_bundle.js:160Understand this error
filler.17f3ba95.js:9 checkSupportDomain domain: localhost
content.js:59 Fetch finished loading: GET "chrome-extension://bjfgambnhccakkhmkepdoekmckoijdlc/content-scripts/content.css".
ry @ content.js:59
iy @ content.js:58
main @ content.js:90
(anonymous) @ content.js:90
(anonymous) @ content.js:90
(anonymous) @ content.js:90
model-config.ts:270 [ModelConfig] Initialized with default Ollama configuration (model auto-detected from client)
installHook.js:1 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Wrap>
      <Provider queryClient={{}}>
        <QueryClientProvider client={{}}>
          <Matches>
            <SafeFragment fallback={null}>
              <Transitioner>
              <MatchesInner>
                <CatchBoundary getResetKey={function getResetKey} errorComponent={function ErrorComponent} ...>
                  <CatchBoundaryImpl getResetKey={function getResetKey} onCatch={function onCatch}>
                    <MatchImpl matchId="__root__">
                      <RootDocument>
                        <html lang="en">
                          <head>
                          <body
-                           cz-shortcut-listen="true"
                          >

overrideMethod @ installHook.js:1
(anonymous) @ react-dom-client.development.js:5439
runWithFiberInDEV @ react-dom-client.development.js:871
emitPendingHydrationWarnings @ react-dom-client.development.js:5438
completeWork @ react-dom-client.development.js:12459
runWithFiberInDEV @ react-dom-client.development.js:874
completeUnitOfWork @ react-dom-client.development.js:17777
performUnitOfWork @ react-dom-client.development.js:17658
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<body>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
RootDocument @ __root.tsx:97
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5Understand this error
model-detection.ts:4 [ModelDetection] Checking Ollama at http://localhost:11434
model-detection.ts:25 [ModelDetection] Failed to detect Ollama models: signal timed out
model-detection.ts:31 [ModelDetection] Checking LM Studio at http://localhost:1234
model-detection.ts:5 Fetch failed loading: GET "http://localhost:11434/api/tags".
detectOllamaModels @ model-detection.ts:5
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ __root.tsx:72
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
(anonymous) @ react-dom-client.development.js:17923
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:50 [ModelDetection] Failed to detect LM Studio models: signal timed out
__root.tsx:81 [App] Active provider: custom-1772899526871 | Active model: glm-5
__root.tsx:82 [Security] API keys are stored securely in Convex, not in browser localStorage
model-detection.ts:32 Fetch failed loading: GET "http://localhost:1234/v1/models".
detectLMStudioModels @ model-detection.ts:32
detectAndUpdateLocalModels @ model-store.ts:426
await in detectAndUpdateLocalModels
(anonymous) @ __root.tsx:72
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
(anonymous) @ react-dom-client.development.js:17923
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
(index):1 Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was receivedUnderstand this error
useCsrfToken.tsx:11 Fetch finished loading: GET "http://localhost:3000/api/csrf-token".
(anonymous) @ useCsrfToken.tsx:11
requestCsrfToken @ useCsrfToken.tsx:21
(anonymous) @ useCsrfToken.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<Home>
exports.createElement @ react.development.js:1054
Lazy @ lazyRouteComponent.tsx:85
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Lazy>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:226
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
OutletImpl @ Match.tsx:356
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<OutletImpl>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:228
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:4 [ModelDetection] Checking Ollama at http://localhost:11434
model-detection.ts:25 [ModelDetection] Failed to detect Ollama models: signal timed out
model-detection.ts:31 [ModelDetection] Checking LM Studio at http://localhost:1234
model-detection.ts:5 Fetch failed loading: GET "http://localhost:11434/api/tags".
detectOllamaModels @ model-detection.ts:5
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ EnhancedModelSelector.tsx?t=1772909495762:23
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<EnhancedModelSelector>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
AgenticChat @ AgenticChat.tsx:483
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<Home>
exports.createElement @ react.development.js:1054
Lazy @ lazyRouteComponent.tsx:85
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Lazy>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:226
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
OutletImpl @ Match.tsx:356
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<OutletImpl>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:228
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:50 [ModelDetection] Failed to detect LM Studio models: signal timed out
model-detection.ts:32 Fetch failed loading: GET "http://localhost:1234/v1/models".
detectLMStudioModels @ model-detection.ts:32
detectAndUpdateLocalModels @ model-store.ts:426
await in detectAndUpdateLocalModels
(anonymous) @ EnhancedModelSelector.tsx?t=1772909495762:23
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<EnhancedModelSelector>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
AgenticChat @ AgenticChat.tsx:483
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<Home>
exports.createElement @ react.development.js:1054
Lazy @ lazyRouteComponent.tsx:85
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Lazy>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:226
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
OutletImpl @ Match.tsx:356
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<OutletImpl>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:228
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:4 [ModelDetection] Checking Ollama at http://localhost:11434
model-detection.ts:25 [ModelDetection] Failed to detect Ollama models: signal timed out
model-detection.ts:31 [ModelDetection] Checking LM Studio at http://localhost:1234
model-detection.ts:5 Fetch failed loading: GET "http://localhost:11434/api/tags".
detectOllamaModels @ model-detection.ts:5
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ SettingsModal.tsx:41
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<SettingsModal>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
AgenticChat @ AgenticChat.tsx:500
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<Home>
exports.createElement @ react.development.js:1054
Lazy @ lazyRouteComponent.tsx:85
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Lazy>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:226
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
OutletImpl @ Match.tsx:356
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<OutletImpl>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:228
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:50 [ModelDetection] Failed to detect LM Studio models: signal timed out
model-detection.ts:32 Fetch failed loading: GET "http://localhost:1234/v1/models".
detectLMStudioModels @ model-detection.ts:32
detectAndUpdateLocalModels @ model-store.ts:426
await in detectAndUpdateLocalModels
(anonymous) @ SettingsModal.tsx:41
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<SettingsModal>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
AgenticChat @ AgenticChat.tsx:500
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<Home>
exports.createElement @ react.development.js:1054
Lazy @ lazyRouteComponent.tsx:85
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Lazy>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:226
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
OutletImpl @ Match.tsx:356
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<OutletImpl>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:228
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:4 [ModelDetection] Checking Ollama at http://localhost:11434
model-detection.ts:25 [ModelDetection] Failed to detect Ollama models: signal timed out
model-detection.ts:31 [ModelDetection] Checking LM Studio at http://localhost:1234
model-detection.ts:5 Fetch failed loading: GET "http://localhost:11434/api/tags".
detectOllamaModels @ model-detection.ts:5
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ EnhancedModelSelector.tsx?t=1772909495762:23
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
model-detection.ts:50 [ModelDetection] Failed to detect LM Studio models: signal timed out
model-detection.ts:32 Fetch failed loading: GET "http://localhost:1234/v1/models".
detectLMStudioModels @ model-detection.ts:32
detectAndUpdateLocalModels @ model-store.ts:426
await in detectAndUpdateLocalModels
(anonymous) @ EnhancedModelSelector.tsx?t=1772909495762:23
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
client:865 [vite] server connection lost. Polling for restart...
  GET http://localhost:3000/ 500 (Internal Server Error)
handleMessage @ :3000/@vite/client:870
await in handleMessage
(anonymous) @ :3000/@vite/client:458
dequeue @ :3000/@vite/client:480
(anonymous) @ :3000/@vite/client:472
enqueue @ :3000/@vite/client:466
(anonymous) @ :3000/@vite/client:458
onMessage @ :3000/@vite/client:305
(anonymous) @ :3000/@vite/client:426Understand this error
webcomponents-ce.js:33 Uncaught Error: A custom element with name 'mce-autosize-textarea' has already been defined.
    at Aa (webcomponents-ce.js:33:363)
    at m.define (webcomponents-ce.js:33:133)
    at overlay_bundle.js:149:5562
    at C (overlay_bundle.js:45:682)
    at overlay_bundle.js:160:392
Aa @ webcomponents-ce.js:33
m.define @ webcomponents-ce.js:33
(anonymous) @ overlay_bundle.js:149
C @ overlay_bundle.js:45
(anonymous) @ overlay_bundle.js:160Understand this error
Navigated to http://localhost:3000/
filler.17f3ba95.js:9 checkSupportDomain domain: localhost
content.js:59 Fetch finished loading: GET "chrome-extension://bjfgambnhccakkhmkepdoekmckoijdlc/content-scripts/content.css".
ry @ content.js:59
iy @ content.js:58
main @ content.js:90
(anonymous) @ content.js:90
(anonymous) @ content.js:90
(anonymous) @ content.js:90
injection-topics.js:1 Browsing Topics API removed from http://localhost:3000/ which is main frame
client:865 [vite] server connection lost. Polling for restart...
Navigated to http://localhost:3000/
injection-topics.js:1 Browsing Topics API removed from http://localhost:3000/ which is main frame
webcomponents-ce.js:33 Uncaught Error: A custom element with name 'mce-autosize-textarea' has already been defined.
    at Aa (webcomponents-ce.js:33:363)
    at m.define (webcomponents-ce.js:33:133)
    at overlay_bundle.js:149:5562
    at C (overlay_bundle.js:45:682)
    at overlay_bundle.js:160:392
Aa @ webcomponents-ce.js:33
m.define @ webcomponents-ce.js:33
(anonymous) @ overlay_bundle.js:149
C @ overlay_bundle.js:45
(anonymous) @ overlay_bundle.js:160Understand this error
filler.17f3ba95.js:9 checkSupportDomain domain: localhost
content.js:59 Fetch finished loading: GET "chrome-extension://bjfgambnhccakkhmkepdoekmckoijdlc/content-scripts/content.css".
ry @ content.js:59
iy @ content.js:58
main @ content.js:90
(anonymous) @ content.js:90
(anonymous) @ content.js:90
(anonymous) @ content.js:90
model-config.ts:270 [ModelConfig] Initialized with default Ollama configuration (model auto-detected from client)
installHook.js:1 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Wrap>
      <Provider queryClient={{}}>
        <QueryClientProvider client={{}}>
          <Matches>
            <SafeFragment fallback={null}>
              <Transitioner>
              <MatchesInner>
                <CatchBoundary getResetKey={function getResetKey} errorComponent={function ErrorComponent} ...>
                  <CatchBoundaryImpl getResetKey={function getResetKey} onCatch={function onCatch}>
                    <MatchImpl matchId="__root__">
                      <RootDocument>
                        <html lang="en">
                          <head>
                          <body
-                           cz-shortcut-listen="true"
                          >

overrideMethod @ installHook.js:1
(anonymous) @ react-dom-client.development.js:5439
runWithFiberInDEV @ react-dom-client.development.js:871
emitPendingHydrationWarnings @ react-dom-client.development.js:5438
completeWork @ react-dom-client.development.js:12459
runWithFiberInDEV @ react-dom-client.development.js:874
completeUnitOfWork @ react-dom-client.development.js:17777
performUnitOfWork @ react-dom-client.development.js:17658
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<body>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
RootDocument @ __root.tsx:113
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5Understand this error
model-detection.ts:42 [ModelDetection] Checking Ollama at http://localhost:11434
model-detection.ts:44 Fetch failed loading: GET "http://localhost:11434/api/tags".
detectOllamaModels @ model-detection.ts:44
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ __root.tsx:90
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
(anonymous) @ react-dom-client.development.js:17923
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:44  GET http://localhost:11434/api/tags net::ERR_CONNECTION_REFUSED
detectOllamaModels @ model-detection.ts:44
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ __root.tsx:90
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
(anonymous) @ react-dom-client.development.js:17923
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5Understand this error
model-detection.ts:69 [ModelDetection] Failed to detect Ollama models: Failed to fetch
model-detection.ts:79 [ModelDetection] Checking LM Studio at http://localhost:1234
model-detection.ts:81 Fetch finished loading: GET "http://localhost:1234/v1/models".
detectLMStudioModels @ model-detection.ts:81
detectAndUpdateLocalModels @ model-store.ts:426
await in detectAndUpdateLocalModels
(anonymous) @ __root.tsx:90
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
(anonymous) @ react-dom-client.development.js:17923
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:100 [ModelDetection] Found 15 LM Studio models: (15) ['nanbeige4.1-3b-heretic', 'text-embedding-kalm-embedding-gemma3-12b-2511', 'text-embedding-nomic-embed-text-v1.5@q4_k_m', 'mistralai/ministral-3-3b', 'qwen/qwen3-1.7b', 'google/gemma-3-1b', 'qwen/qwen3-4b-thinking-2507', 'qwen/qwen3-4b-2507', 'resume-model', 'gemma-3-270m-it', 'text-embedding-nomic-embed-text-v1.5-embedding', 'text-embedding-qwen3-embedding-0.6b', 'text-embedding-mxbai-embed-large-v1', 'text-embedding-nomic-embed-code', 'text-embedding-nomic-embed-text-v1.5@f32']
__root.tsx:98 [App] Detected LM Studio models: (15) ['nanbeige4.1-3b-heretic', 'text-embedding-kalm-embedding-gemma3-12b-2511', 'text-embedding-nomic-embed-text-v1.5@q4_k_m', 'mistralai/ministral-3-3b', 'qwen/qwen3-1.7b', 'google/gemma-3-1b', 'qwen/qwen3-4b-thinking-2507', 'qwen/qwen3-4b-2507', 'resume-model', 'gemma-3-270m-it', 'text-embedding-nomic-embed-text-v1.5-embedding', 'text-embedding-qwen3-embedding-0.6b', 'text-embedding-mxbai-embed-large-v1', 'text-embedding-nomic-embed-code', 'text-embedding-nomic-embed-text-v1.5@f32']
__root.tsx:100 [App] Active provider: custom-1772899526871 | Active model: glm-5
__root.tsx:101 [Security] API keys are stored securely in Convex, not in browser localStorage
client:865 [vite] server connection lost. Polling for restart...
useCsrfToken.tsx:11 Fetch finished loading: GET "http://localhost:3000/api/csrf-token".
(anonymous) @ useCsrfToken.tsx:11
requestCsrfToken @ useCsrfToken.tsx:21
(anonymous) @ useCsrfToken.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<Home>
exports.createElement @ react.development.js:1054
Lazy @ lazyRouteComponent.tsx:85
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Lazy>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:226
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
OutletImpl @ Match.tsx:356
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<OutletImpl>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:228
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
Navigated to http://localhost:3000/
injection-topics.js:1 Browsing Topics API removed from http://localhost:3000/ which is main frame
webcomponents-ce.js:33 Uncaught Error: A custom element with name 'mce-autosize-textarea' has already been defined.
    at Aa (webcomponents-ce.js:33:363)
    at m.define (webcomponents-ce.js:33:133)
    at overlay_bundle.js:149:5562
    at C (overlay_bundle.js:45:682)
    at overlay_bundle.js:160:392
Aa @ webcomponents-ce.js:33
m.define @ webcomponents-ce.js:33
(anonymous) @ overlay_bundle.js:149
C @ overlay_bundle.js:45
(anonymous) @ overlay_bundle.js:160Understand this error
filler.17f3ba95.js:9 checkSupportDomain domain: localhost
content.js:59 Fetch finished loading: GET "chrome-extension://bjfgambnhccakkhmkepdoekmckoijdlc/content-scripts/content.css".
ry @ content.js:59
iy @ content.js:58
main @ content.js:90
(anonymous) @ content.js:90
(anonymous) @ content.js:90
(anonymous) @ content.js:90
model-config.ts:270 [ModelConfig] Initialized with default Ollama configuration (model auto-detected from client)
installHook.js:1 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Wrap>
      <Provider queryClient={{}}>
        <QueryClientProvider client={{}}>
          <Matches>
            <SafeFragment fallback={null}>
              <Transitioner>
              <MatchesInner>
                <CatchBoundary getResetKey={function getResetKey} errorComponent={function ErrorComponent} ...>
                  <CatchBoundaryImpl getResetKey={function getResetKey} onCatch={function onCatch}>
                    <MatchImpl matchId="__root__">
                      <RootDocument>
                        <html lang="en">
                          <head>
                          <body
-                           cz-shortcut-listen="true"
                          >

overrideMethod @ installHook.js:1
(anonymous) @ react-dom-client.development.js:5439
runWithFiberInDEV @ react-dom-client.development.js:871
emitPendingHydrationWarnings @ react-dom-client.development.js:5438
completeWork @ react-dom-client.development.js:12459
runWithFiberInDEV @ react-dom-client.development.js:874
completeUnitOfWork @ react-dom-client.development.js:17777
performUnitOfWork @ react-dom-client.development.js:17658
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<body>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
RootDocument @ __root.tsx:113
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5Understand this error
model-detection.ts:42 [ModelDetection] Checking Ollama at http://localhost:11434
model-detection.ts:44 Fetch failed loading: GET "http://localhost:11434/api/tags".
detectOllamaModels @ model-detection.ts:44
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ __root.tsx:90
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
(anonymous) @ react-dom-client.development.js:17923
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:44  GET http://localhost:11434/api/tags net::ERR_CONNECTION_REFUSED
detectOllamaModels @ model-detection.ts:44
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ __root.tsx:90
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
(anonymous) @ react-dom-client.development.js:17923
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5Understand this error
model-detection.ts:69 [ModelDetection] Failed to detect Ollama models: Failed to fetch
model-detection.ts:79 [ModelDetection] Checking LM Studio at http://localhost:1234
model-detection.ts:81 Fetch finished loading: GET "http://localhost:1234/v1/models".
detectLMStudioModels @ model-detection.ts:81
detectAndUpdateLocalModels @ model-store.ts:426
await in detectAndUpdateLocalModels
(anonymous) @ __root.tsx:90
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
(anonymous) @ react-dom-client.development.js:17923
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:100 [ModelDetection] Found 15 LM Studio models: (15) ['nanbeige4.1-3b-heretic', 'text-embedding-kalm-embedding-gemma3-12b-2511', 'text-embedding-nomic-embed-text-v1.5@q4_k_m', 'mistralai/ministral-3-3b', 'qwen/qwen3-1.7b', 'google/gemma-3-1b', 'qwen/qwen3-4b-thinking-2507', 'qwen/qwen3-4b-2507', 'resume-model', 'gemma-3-270m-it', 'text-embedding-nomic-embed-text-v1.5-embedding', 'text-embedding-qwen3-embedding-0.6b', 'text-embedding-mxbai-embed-large-v1', 'text-embedding-nomic-embed-code', 'text-embedding-nomic-embed-text-v1.5@f32']
__root.tsx:98 [App] Detected LM Studio models: (15) ['nanbeige4.1-3b-heretic', 'text-embedding-kalm-embedding-gemma3-12b-2511', 'text-embedding-nomic-embed-text-v1.5@q4_k_m', 'mistralai/ministral-3-3b', 'qwen/qwen3-1.7b', 'google/gemma-3-1b', 'qwen/qwen3-4b-thinking-2507', 'qwen/qwen3-4b-2507', 'resume-model', 'gemma-3-270m-it', 'text-embedding-nomic-embed-text-v1.5-embedding', 'text-embedding-qwen3-embedding-0.6b', 'text-embedding-mxbai-embed-large-v1', 'text-embedding-nomic-embed-code', 'text-embedding-nomic-embed-text-v1.5@f32']
__root.tsx:100 [App] Active provider: custom-1772899526871 | Active model: glm-5
__root.tsx:101 [Security] API keys are stored securely in Convex, not in browser localStorage
useCsrfToken.tsx:11 Fetch finished loading: GET "http://localhost:3000/api/csrf-token".
(anonymous) @ useCsrfToken.tsx:11
requestCsrfToken @ useCsrfToken.tsx:21
(anonymous) @ useCsrfToken.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<Home>
exports.createElement @ react.development.js:1054
Lazy @ lazyRouteComponent.tsx:85
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Lazy>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:226
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
OutletImpl @ Match.tsx:356
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<OutletImpl>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:228
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
Navigated to http://localhost:3000/
injection-topics.js:1 Browsing Topics API removed from http://localhost:3000/ which is main frame
webcomponents-ce.js:33 Uncaught Error: A custom element with name 'mce-autosize-textarea' has already been defined.
    at Aa (webcomponents-ce.js:33:363)
    at m.define (webcomponents-ce.js:33:133)
    at overlay_bundle.js:149:5562
    at C (overlay_bundle.js:45:682)
    at overlay_bundle.js:160:392
Aa @ webcomponents-ce.js:33
m.define @ webcomponents-ce.js:33
(anonymous) @ overlay_bundle.js:149
C @ overlay_bundle.js:45
(anonymous) @ overlay_bundle.js:160Understand this error
filler.17f3ba95.js:9 checkSupportDomain domain: localhost
content.js:59 Fetch finished loading: GET "chrome-extension://bjfgambnhccakkhmkepdoekmckoijdlc/content-scripts/content.css".
ry @ content.js:59
iy @ content.js:58
main @ content.js:90
(anonymous) @ content.js:90
(anonymous) @ content.js:90
(anonymous) @ content.js:90
model-config.ts:270 [ModelConfig] Initialized with default Ollama configuration (model auto-detected from client)
installHook.js:1 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Wrap>
      <Provider queryClient={{}}>
        <QueryClientProvider client={{}}>
          <Matches>
            <SafeFragment fallback={null}>
              <Transitioner>
              <MatchesInner>
                <CatchBoundary getResetKey={function getResetKey} errorComponent={function ErrorComponent} ...>
                  <CatchBoundaryImpl getResetKey={function getResetKey} onCatch={function onCatch}>
                    <MatchImpl matchId="__root__">
                      <RootDocument>
                        <html lang="en">
                          <head>
                          <body
-                           cz-shortcut-listen="true"
                          >

overrideMethod @ installHook.js:1
(anonymous) @ react-dom-client.development.js:5439
runWithFiberInDEV @ react-dom-client.development.js:871
emitPendingHydrationWarnings @ react-dom-client.development.js:5438
completeWork @ react-dom-client.development.js:12459
runWithFiberInDEV @ react-dom-client.development.js:874
completeUnitOfWork @ react-dom-client.development.js:17777
performUnitOfWork @ react-dom-client.development.js:17658
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<body>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
RootDocument @ __root.tsx:113
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5Understand this error
model-detection.ts:4 [ModelDetection] Checking Ollama at http://localhost:11434
model-detection.ts:5 Fetch failed loading: GET "http://localhost:11434/api/tags".
detectOllamaModels @ model-detection.ts:5
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ __root.tsx:90
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
(anonymous) @ react-dom-client.development.js:17923
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:5  GET http://localhost:11434/api/tags net::ERR_CONNECTION_REFUSED
detectOllamaModels @ model-detection.ts:5
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ __root.tsx:90
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
(anonymous) @ react-dom-client.development.js:17923
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5Understand this error
model-detection.ts:25 [ModelDetection] Failed to detect Ollama models: Failed to fetch
model-detection.ts:31 [ModelDetection] Checking LM Studio at http://localhost:1234
model-detection.ts:47 [ModelDetection] Found 15 LM Studio models: (15) ['nanbeige4.1-3b-heretic', 'text-embedding-kalm-embedding-gemma3-12b-2511', 'text-embedding-nomic-embed-text-v1.5@q4_k_m', 'mistralai/ministral-3-3b', 'qwen/qwen3-1.7b', 'google/gemma-3-1b', 'qwen/qwen3-4b-thinking-2507', 'qwen/qwen3-4b-2507', 'resume-model', 'gemma-3-270m-it', 'text-embedding-nomic-embed-text-v1.5-embedding', 'text-embedding-qwen3-embedding-0.6b', 'text-embedding-mxbai-embed-large-v1', 'text-embedding-nomic-embed-code', 'text-embedding-nomic-embed-text-v1.5@f32']
__root.tsx:98 [App] Detected LM Studio models: (15) ['nanbeige4.1-3b-heretic', 'text-embedding-kalm-embedding-gemma3-12b-2511', 'text-embedding-nomic-embed-text-v1.5@q4_k_m', 'mistralai/ministral-3-3b', 'qwen/qwen3-1.7b', 'google/gemma-3-1b', 'qwen/qwen3-4b-thinking-2507', 'qwen/qwen3-4b-2507', 'resume-model', 'gemma-3-270m-it', 'text-embedding-nomic-embed-text-v1.5-embedding', 'text-embedding-qwen3-embedding-0.6b', 'text-embedding-mxbai-embed-large-v1', 'text-embedding-nomic-embed-code', 'text-embedding-nomic-embed-text-v1.5@f32']
__root.tsx:100 [App] Active provider: custom-1772899526871 | Active model: glm-5
__root.tsx:101 [Security] API keys are stored securely in Convex, not in browser localStorage
model-detection.ts:32 Fetch finished loading: GET "http://localhost:1234/v1/models".
detectLMStudioModels @ model-detection.ts:32
detectAndUpdateLocalModels @ model-store.ts:426
await in detectAndUpdateLocalModels
(anonymous) @ __root.tsx:90
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
(anonymous) @ react-dom-client.development.js:17923
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
useCsrfToken.tsx:11 Fetch finished loading: GET "http://localhost:3000/api/csrf-token".
(anonymous) @ useCsrfToken.tsx:11
requestCsrfToken @ useCsrfToken.tsx:21
(anonymous) @ useCsrfToken.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<Home>
exports.createElement @ react.development.js:1054
Lazy @ lazyRouteComponent.tsx:85
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Lazy>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:226
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
OutletImpl @ Match.tsx:356
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<OutletImpl>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:228
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts?t=1772910152883:4 [ModelDetection] Checking Ollama at http://localhost:11434
model-detection.ts?t=1772910152883:4 [ModelDetection] Checking Ollama at http://localhost:11434
model-detection.ts?t=1772910152883:16 [ModelDetection] Ollama not available: internal error; reference = up0ujp95rdcnlpsa18er1pcj
model-detection.ts?t=1772910152883:6 Fetch finished loading: GET "http://localhost:3000/api/detect-models?provider=ollama&baseUrl=http%3A%2F%2Flocalhost%3A11434".
detectOllamaModels @ model-detection.ts?t=1772910152883:6
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ EnhancedModelSelector.tsx:47
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<EnhancedModelSelector>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
AgenticChat @ AgenticChat.tsx:483
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<Home>
exports.createElement @ react.development.js:1054
Lazy @ lazyRouteComponent.tsx:85
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Lazy>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:226
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
OutletImpl @ Match.tsx:356
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<OutletImpl>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:228
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts?t=1772910152883:25 [ModelDetection] Found 0 Ollama models: []
model-detection.ts?t=1772910152883:34 [ModelDetection] Checking LM Studio at http://localhost:1234
model-detection.ts?t=1772910152883:35 Fetch finished loading: GET "http://localhost:1234/v1/models".
detectLMStudioModels @ model-detection.ts?t=1772910152883:35
detectAndUpdateLocalModels @ model-store.ts:426
await in detectAndUpdateLocalModels
(anonymous) @ EnhancedModelSelector.tsx:47
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<EnhancedModelSelector>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
AgenticChat @ AgenticChat.tsx:483
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<Home>
exports.createElement @ react.development.js:1054
Lazy @ lazyRouteComponent.tsx:85
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Lazy>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:226
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
OutletImpl @ Match.tsx:356
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<OutletImpl>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:228
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts?t=1772910152883:50 [ModelDetection] Found 15 LM Studio models: (15) ['nanbeige4.1-3b-heretic', 'text-embedding-kalm-embedding-gemma3-12b-2511', 'text-embedding-nomic-embed-text-v1.5@q4_k_m', 'mistralai/ministral-3-3b', 'qwen/qwen3-1.7b', 'google/gemma-3-1b', 'qwen/qwen3-4b-thinking-2507', 'qwen/qwen3-4b-2507', 'resume-model', 'gemma-3-270m-it', 'text-embedding-nomic-embed-text-v1.5-embedding', 'text-embedding-qwen3-embedding-0.6b', 'text-embedding-mxbai-embed-large-v1', 'text-embedding-nomic-embed-code', 'text-embedding-nomic-embed-text-v1.5@f32']
model-detection.ts?t=1772910152883:16 [ModelDetection] Ollama not available: internal error; reference = k1h2u2hpbk7jk3n8a2818j88
model-detection.ts?t=1772910152883:6 Fetch finished loading: GET "http://localhost:3000/api/detect-models?provider=ollama&baseUrl=http%3A%2F%2Flocalhost%3A11434".
detectOllamaModels @ model-detection.ts?t=1772910152883:6
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ SettingsModal.tsx:64
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<SettingsModal>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
AgenticChat @ AgenticChat.tsx:500
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<Home>
exports.createElement @ react.development.js:1054
Lazy @ lazyRouteComponent.tsx:85
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Lazy>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:226
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
OutletImpl @ Match.tsx:356
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<OutletImpl>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:228
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts?t=1772910152883:25 [ModelDetection] Found 0 Ollama models: []
model-detection.ts?t=1772910152883:34 [ModelDetection] Checking LM Studio at http://localhost:1234
model-detection.ts?t=1772910152883:50 [ModelDetection] Found 15 LM Studio models: (15) ['nanbeige4.1-3b-heretic', 'text-embedding-kalm-embedding-gemma3-12b-2511', 'text-embedding-nomic-embed-text-v1.5@q4_k_m', 'mistralai/ministral-3-3b', 'qwen/qwen3-1.7b', 'google/gemma-3-1b', 'qwen/qwen3-4b-thinking-2507', 'qwen/qwen3-4b-2507', 'resume-model', 'gemma-3-270m-it', 'text-embedding-nomic-embed-text-v1.5-embedding', 'text-embedding-qwen3-embedding-0.6b', 'text-embedding-mxbai-embed-large-v1', 'text-embedding-nomic-embed-code', 'text-embedding-nomic-embed-text-v1.5@f32']
model-detection.ts?t=1772910152883:35 Fetch finished loading: GET "http://localhost:1234/v1/models".
detectLMStudioModels @ model-detection.ts?t=1772910152883:35
detectAndUpdateLocalModels @ model-store.ts:426
await in detectAndUpdateLocalModels
(anonymous) @ SettingsModal.tsx:64
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
model-detection.ts:42 [ModelDetection] Checking Ollama at http://localhost:11434
model-detection.ts:46 Fetch finished loading: GET "http://localhost:3000/api/detect-models?provider=ollama&baseUrl=http%3A%2F%2Flocalhost%3A11434".
detectOllamaModels @ model-detection.ts:46
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ SettingsModal.tsx:64
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
flushSyncWork$1 @ react-dom-client.development.js:16898
scheduleRefresh @ react-dom-client.development.js:113
S.scheduleRefresh @ installHook.js:1
(anonymous) @ @react-refresh:228
performReactRefresh @ @react-refresh:217
(anonymous) @ @react-refresh:604
model-detection.ts:59 [ModelDetection] Ollama not available: internal error; reference = un57b35gsclo0gicu48nfrga
model-detection.ts:70 [ModelDetection] Found 0 Ollama models: []
model-detection.ts:84 [ModelDetection] Checking LM Studio at http://localhost:1234
model-detection.ts:112 [ModelDetection] Found 15 LM Studio models: (15) ['nanbeige4.1-3b-heretic', 'text-embedding-kalm-embedding-gemma3-12b-2511', 'text-embedding-nomic-embed-text-v1.5@q4_k_m', 'mistralai/ministral-3-3b', 'qwen/qwen3-1.7b', 'google/gemma-3-1b', 'qwen/qwen3-4b-thinking-2507', 'qwen/qwen3-4b-2507', 'resume-model', 'gemma-3-270m-it', 'text-embedding-nomic-embed-text-v1.5-embedding', 'text-embedding-qwen3-embedding-0.6b', 'text-embedding-mxbai-embed-large-v1', 'text-embedding-nomic-embed-code', 'text-embedding-nomic-embed-text-v1.5@f32']
model-detection.ts:88 Fetch finished loading: GET "http://localhost:3000/api/detect-models?provider=lmstudio&baseUrl=http%3A%2F%2Flocalhost%3A1234".
detectLMStudioModels @ model-detection.ts:88
detectAndUpdateLocalModels @ model-store.ts:426
await in detectAndUpdateLocalModels
(anonymous) @ SettingsModal.tsx:64
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
flushSyncWork$1 @ react-dom-client.development.js:16898
scheduleRefresh @ react-dom-client.development.js:113
S.scheduleRefresh @ installHook.js:1
(anonymous) @ @react-refresh:228
performReactRefresh @ @react-refresh:217
(anonymous) @ @react-refresh:604
injection-topics.js:1 Browsing Topics API removed from http://localhost:3000/ which is main frame
webcomponents-ce.js:33 Uncaught Error: A custom element with name 'mce-autosize-textarea' has already been defined.
    at Aa (webcomponents-ce.js:33:363)
    at m.define (webcomponents-ce.js:33:133)
    at overlay_bundle.js:149:5562
    at C (overlay_bundle.js:45:682)
    at overlay_bundle.js:160:392
Aa @ webcomponents-ce.js:33
m.define @ webcomponents-ce.js:33
(anonymous) @ overlay_bundle.js:149
C @ overlay_bundle.js:45
(anonymous) @ overlay_bundle.js:160Understand this error
Navigated to http://localhost:3000/
filler.17f3ba95.js:9 checkSupportDomain domain: localhost
content.js:59 Fetch finished loading: GET "chrome-extension://bjfgambnhccakkhmkepdoekmckoijdlc/content-scripts/content.css".
ry @ content.js:59
iy @ content.js:58
main @ content.js:90
(anonymous) @ content.js:90
(anonymous) @ content.js:90
(anonymous) @ content.js:90
model-config.ts:270 [ModelConfig] Initialized with default Ollama configuration (model auto-detected from client)
installHook.js:1 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Wrap>
      <Provider queryClient={{}}>
        <QueryClientProvider client={{}}>
          <Matches>
            <SafeFragment fallback={null}>
              <Transitioner>
              <MatchesInner>
                <CatchBoundary getResetKey={function getResetKey} errorComponent={function ErrorComponent} ...>
                  <CatchBoundaryImpl getResetKey={function getResetKey} onCatch={function onCatch}>
                    <MatchImpl matchId="__root__">
                      <RootDocument>
                        <html lang="en">
                          <head>
                          <body
-                           cz-shortcut-listen="true"
                          >

overrideMethod @ installHook.js:1
(anonymous) @ react-dom-client.development.js:5439
runWithFiberInDEV @ react-dom-client.development.js:871
emitPendingHydrationWarnings @ react-dom-client.development.js:5438
completeWork @ react-dom-client.development.js:12459
runWithFiberInDEV @ react-dom-client.development.js:874
completeUnitOfWork @ react-dom-client.development.js:17777
performUnitOfWork @ react-dom-client.development.js:17658
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<body>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
RootDocument @ __root.tsx:113
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5Understand this error
model-detection.ts:42 [ModelDetection] Checking Ollama at http://localhost:11434
model-detection.ts:46 Fetch finished loading: GET "http://localhost:3000/api/detect-models?provider=ollama&baseUrl=http%3A%2F%2Flocalhost%3A11434".
detectOllamaModels @ model-detection.ts:46
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ __root.tsx:90
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
(anonymous) @ react-dom-client.development.js:17923
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:59 [ModelDetection] Ollama not available: internal error; reference = 2grjrk7gquqp2221o56itjre
model-detection.ts:70 [ModelDetection] Found 0 Ollama models: []
model-detection.ts:84 [ModelDetection] Checking LM Studio at http://localhost:1234
model-detection.ts:112 [ModelDetection] Found 15 LM Studio models: (15) ['nanbeige4.1-3b-heretic', 'text-embedding-kalm-embedding-gemma3-12b-2511', 'text-embedding-nomic-embed-text-v1.5@q4_k_m', 'mistralai/ministral-3-3b', 'qwen/qwen3-1.7b', 'google/gemma-3-1b', 'qwen/qwen3-4b-thinking-2507', 'qwen/qwen3-4b-2507', 'resume-model', 'gemma-3-270m-it', 'text-embedding-nomic-embed-text-v1.5-embedding', 'text-embedding-qwen3-embedding-0.6b', 'text-embedding-mxbai-embed-large-v1', 'text-embedding-nomic-embed-code', 'text-embedding-nomic-embed-text-v1.5@f32']
__root.tsx:98 [App] Detected LM Studio models: (15) ['nanbeige4.1-3b-heretic', 'text-embedding-kalm-embedding-gemma3-12b-2511', 'text-embedding-nomic-embed-text-v1.5@q4_k_m', 'mistralai/ministral-3-3b', 'qwen/qwen3-1.7b', 'google/gemma-3-1b', 'qwen/qwen3-4b-thinking-2507', 'qwen/qwen3-4b-2507', 'resume-model', 'gemma-3-270m-it', 'text-embedding-nomic-embed-text-v1.5-embedding', 'text-embedding-qwen3-embedding-0.6b', 'text-embedding-mxbai-embed-large-v1', 'text-embedding-nomic-embed-code', 'text-embedding-nomic-embed-text-v1.5@f32']
__root.tsx:100 [App] Active provider: custom-1772899526871 | Active model: glm-5
__root.tsx:101 [Security] API keys are stored securely in Convex, not in browser localStorage
model-detection.ts:88 Fetch finished loading: GET "http://localhost:3000/api/detect-models?provider=lmstudio&baseUrl=http%3A%2F%2Flocalhost%3A1234".
detectLMStudioModels @ model-detection.ts:88
detectAndUpdateLocalModels @ model-store.ts:426
await in detectAndUpdateLocalModels
(anonymous) @ __root.tsx:90
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
(anonymous) @ react-dom-client.development.js:17923
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
useCsrfToken.tsx:11 Fetch finished loading: GET "http://localhost:3000/api/csrf-token".
(anonymous) @ useCsrfToken.tsx:11
requestCsrfToken @ useCsrfToken.tsx:21
(anonymous) @ useCsrfToken.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<Home>
exports.createElement @ react.development.js:1054
Lazy @ lazyRouteComponent.tsx:85
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Lazy>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:226
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
OutletImpl @ Match.tsx:356
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<OutletImpl>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:228
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:42 [ModelDetection] Checking Ollama at http://localhost:11434
completion_list.html?username=&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.399999999…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.399999999…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.399999999…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
model-detection.ts:59 [ModelDetection] Ollama not available: internal error; reference = tqmlj8h6qs5mf40hhhg86ath
model-detection.ts:70 [ModelDetection] Found 0 Ollama models: []
model-detection.ts:84 [ModelDetection] Checking LM Studio at http://localhost:1234
model-detection.ts:46 Fetch finished loading: GET "http://localhost:3000/api/detect-models?provider=ollama&baseUrl=http%3A%2F%2Flocalhost%3A11434".
detectOllamaModels @ model-detection.ts:46
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ SettingsModal.tsx:64
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<SettingsModal>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
AgenticChat @ AgenticChat.tsx:500
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<Home>
exports.createElement @ react.development.js:1054
Lazy @ lazyRouteComponent.tsx:85
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Lazy>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:226
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
OutletImpl @ Match.tsx:356
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<OutletImpl>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:228
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:88 Fetch finished loading: GET "http://localhost:3000/api/detect-models?provider=lmstudio&baseUrl=http%3A%2F%2Flocalhost%3A1234".
detectLMStudioModels @ model-detection.ts:88
detectAndUpdateLocalModels @ model-store.ts:426
await in detectAndUpdateLocalModels
(anonymous) @ SettingsModal.tsx:64
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<SettingsModal>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
AgenticChat @ AgenticChat.tsx:500
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<AgenticChat>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
Home @ index.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16504
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
<Home>
exports.createElement @ react.development.js:1054
Lazy @ lazyRouteComponent.tsx:85
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Lazy>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:226
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
OutletImpl @ Match.tsx:356
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<OutletImpl>
exports.jsx @ react-jsx-runtime.development.js:335
(anonymous) @ Match.tsx:228
mountMemo @ react-dom-client.development.js:8777
useMemo @ react-dom-client.development.js:26216
exports.useMemo @ react.development.js:1251
MatchInnerImpl @ Match.tsx:223
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooks @ react-dom-client.development.js:7662
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchInnerImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchImpl @ Match.tsx:132
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:112 [ModelDetection] Found 15 LM Studio models: (15) ['nanbeige4.1-3b-heretic', 'text-embedding-kalm-embedding-gemma3-12b-2511', 'text-embedding-nomic-embed-text-v1.5@q4_k_m', 'mistralai/ministral-3-3b', 'qwen/qwen3-1.7b', 'google/gemma-3-1b', 'qwen/qwen3-4b-thinking-2507', 'qwen/qwen3-4b-2507', 'resume-model', 'gemma-3-270m-it', 'text-embedding-nomic-embed-text-v1.5-embedding', 'text-embedding-qwen3-embedding-0.6b', 'text-embedding-mxbai-embed-large-v1', 'text-embedding-nomic-embed-code', 'text-embedding-nomic-embed-text-v1.5@f32']
completion_list.html?username=&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.399999999…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.399999999…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.399999999…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=ht&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.3999999…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=ht&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.3999999…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=ht&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.3999999…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=htt&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.399999…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=htt&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.399999…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=htt&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.399999…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.39999…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.39999…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.39999…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=https&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.3999…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=https&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.3999…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=https&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.3999…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=https:&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.399…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=https:&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.399…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=https:&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.399…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=https&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.3999…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=https&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.3999…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=https&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.3999…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.39999…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.39999…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.39999…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http:&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.3999…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http:&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.3999…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http:&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.3999…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http:/&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.399…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http:/&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.399…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http:/&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.399…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.39…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.39…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.39…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://l&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.3…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://l&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.3…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://l&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926.3…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://loc&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://loc&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://loc&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://loc&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://loc&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://loc&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1926…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://local&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=19…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://local&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=19…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://local&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=19…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://local&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=19…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://local&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=19…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://local&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=19…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://local&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=19…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://local&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=19…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://local&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=19…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://local&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=19…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://local&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=19…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://local&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=19…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localh&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localh&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localh&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=1…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localho&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localho&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localho&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth=…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhos&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhos&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhos&colorScheme=&screenX=0&screenY=0&effectiveWindowWidth…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost&colorScheme=&screenX=0&screenY=0&effectiveWindowWidt…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost&colorScheme=&screenX=0&screenY=0&effectiveWindowWidt…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost&colorScheme=&screenX=0&screenY=0&effectiveWindowWidt…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:&colorScheme=&screenX=0&screenY=0&effectiveWindowWid…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:&colorScheme=&screenX=0&screenY=0&effectiveWindowWid…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:&colorScheme=&screenX=0&screenY=0&effectiveWindowWid…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1&colorScheme=&screenX=0&screenY=0&effectiveWindowWi…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1&colorScheme=&screenX=0&screenY=0&effectiveWindowWi…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1&colorScheme=&screenX=0&screenY=0&effectiveWindowWi…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:12&colorScheme=&screenX=0&screenY=0&effectiveWindowW…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:12&colorScheme=&screenX=0&screenY=0&effectiveWindowW…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:12&colorScheme=&screenX=0&screenY=0&effectiveWindowW…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:123&colorScheme=&screenX=0&screenY=0&effectiveWindow…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:123&colorScheme=&screenX=0&screenY=0&effectiveWindow…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:123&colorScheme=&screenX=0&screenY=0&effectiveWindow…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:12345&colorScheme=&screenX=0&screenY=0&effectiveWind…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:12345&colorScheme=&screenX=0&screenY=0&effectiveWind…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:12345&colorScheme=&screenX=0&screenY=0&effectiveWind…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:12345&colorScheme=&screenX=0&screenY=0&effectiveWind…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:12345&colorScheme=&screenX=0&screenY=0&effectiveWind…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:12345&colorScheme=&screenX=0&screenY=0&effectiveWind…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234&colorScheme=&screenX=0&screenY=0&effectiveWindo…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234&colorScheme=&screenX=0&screenY=0&effectiveWindo…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234&colorScheme=&screenX=0&screenY=0&effectiveWindo…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234&colorScheme=&screenX=0&screenY=0&effectiveWindo…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234&colorScheme=&screenX=0&screenY=0&effectiveWindo…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234&colorScheme=&screenX=0&screenY=0&effectiveWindo…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234&colorScheme=&screenX=0&screenY=0&effectiveWindo…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234&colorScheme=&screenX=0&screenY=0&effectiveWindo…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234&colorScheme=&screenX=0&screenY=0&effectiveWindo…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234/&colorScheme=&screenX=0&screenY=0&effectiveWind…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234/&colorScheme=&screenX=0&screenY=0&effectiveWind…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234/&colorScheme=&screenX=0&screenY=0&effectiveWind…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234/v&colorScheme=&screenX=0&screenY=0&effectiveWin…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234/v&colorScheme=&screenX=0&screenY=0&effectiveWin…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234/v&colorScheme=&screenX=0&screenY=0&effectiveWin…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234/vi&colorScheme=&screenX=0&screenY=0&effectiveWi…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234/vi&colorScheme=&screenX=0&screenY=0&effectiveWi…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234/vi&colorScheme=&screenX=0&screenY=0&effectiveWi…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js:1  Failed to load resource: net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234/vi&colorScheme=&screenX=0&screenY=0&effectiveWi…:12  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/utils.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234/vi&colorScheme=&screenX=0&screenY=0&effectiveWi…:13  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/extensionState.js net::ERR_FILE_NOT_FOUNDUnderstand this error
completion_list.html?username=http://localhost:1234/vi&colorScheme=&screenX=0&screenY=0&effectiveWi…:14  GET chrome-extension://pejdijmoenmkgeppbflobdenhhabjlaj/heuristicsRedefinitions.js net::ERR_FILE_NOT_FOUNDUnderstand this error
model-detection.ts:42 [ModelDetection] Checking Ollama at http://localhost:11434
model-detection.ts:46 Fetch finished loading: GET "http://localhost:3000/api/detect-models?provider=ollama&baseUrl=http%3A%2F%2Flocalhost%3A11434".
detectOllamaModels @ model-detection.ts:46
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ SettingsModal.tsx:64
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
model-detection.ts:59 [ModelDetection] Ollama not available: internal error; reference = le87dkn24138vo440k24g4iq
model-detection.ts:70 [ModelDetection] Found 0 Ollama models: []
model-detection.ts:84 [ModelDetection] Checking LM Studio at http://localhost:1234
model-detection.ts:112 [ModelDetection] Found 15 LM Studio models: (15) ['nanbeige4.1-3b-heretic', 'text-embedding-kalm-embedding-gemma3-12b-2511', 'text-embedding-nomic-embed-text-v1.5@q4_k_m', 'mistralai/ministral-3-3b', 'qwen/qwen3-1.7b', 'google/gemma-3-1b', 'qwen/qwen3-4b-thinking-2507', 'qwen/qwen3-4b-2507', 'resume-model', 'gemma-3-270m-it', 'text-embedding-nomic-embed-text-v1.5-embedding', 'text-embedding-qwen3-embedding-0.6b', 'text-embedding-mxbai-embed-large-v1', 'text-embedding-nomic-embed-code', 'text-embedding-nomic-embed-text-v1.5@f32']
model-detection.ts:88 Fetch finished loading: GET "http://localhost:3000/api/detect-models?provider=lmstudio&baseUrl=http%3A%2F%2Flocalhost%3A1234".
detectLMStudioModels @ model-detection.ts:88
detectAndUpdateLocalModels @ model-store.ts:426
await in detectAndUpdateLocalModels
(anonymous) @ SettingsModal.tsx:64
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15666
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15633
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
flushPendingEffects @ react-dom-client.development.js:18358
flushSpawnedWork @ react-dom-client.development.js:18323
commitRoot @ react-dom-client.development.js:17955
commitRootWhenReady @ react-dom-client.development.js:16824
performWorkOnRoot @ react-dom-client.development.js:16722
performSyncWorkOnRoot @ react-dom-client.development.js:18972
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:18814
processRootScheduleInMicrotask @ react-dom-client.development.js:18853
(anonymous) @ react-dom-client.development.js:18991
(index):1 Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was receivedUnderstand this error
webcomponents-ce.js:33 Uncaught Error: A custom element with name 'mce-autosize-textarea' has already been defined.
    at Aa (webcomponents-ce.js:33:363)
    at m.define (webcomponents-ce.js:33:133)
    at overlay_bundle.js:149:5562
    at C (overlay_bundle.js:45:682)
    at overlay_bundle.js:160:392
Aa @ webcomponents-ce.js:33
m.define @ webcomponents-ce.js:33
(anonymous) @ overlay_bundle.js:149
C @ overlay_bundle.js:45
(anonymous) @ overlay_bundle.js:160Understand this error
filler.17f3ba95.js:9 checkSupportDomain domain: localhost
Navigated to http://localhost:3000/
injection-topics.js:1 Browsing Topics API removed from http://localhost:3000/ which is main frame
model-config.ts:270 [ModelConfig] Initialized with default Ollama configuration (model auto-detected from client)
installHook.js:1 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <Wrap>
      <Provider queryClient={{}}>
        <QueryClientProvider client={{}}>
          <Matches>
            <SafeFragment fallback={null}>
              <Transitioner>
              <MatchesInner>
                <CatchBoundary getResetKey={function getResetKey} errorComponent={function ErrorComponent} ...>
                  <CatchBoundaryImpl getResetKey={function getResetKey} onCatch={function onCatch}>
                    <MatchImpl matchId="__root__">
                      <RootDocument>
                        <html lang="en">
                          <head>
                          <body
-                           cz-shortcut-listen="true"
                          >

overrideMethod @ installHook.js:1
(anonymous) @ react-dom-client.development.js:5439
runWithFiberInDEV @ react-dom-client.development.js:871
emitPendingHydrationWarnings @ react-dom-client.development.js:5438
completeWork @ react-dom-client.development.js:12459
runWithFiberInDEV @ react-dom-client.development.js:874
completeUnitOfWork @ react-dom-client.development.js:17777
performUnitOfWork @ react-dom-client.development.js:17658
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<body>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
RootDocument @ __root.tsx:113
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5Understand this error
model-detection.ts:42 [ModelDetection] Checking Ollama at http://localhost:11434
content.js:59 Fetch finished loading: GET "chrome-extension://bjfgambnhccakkhmkepdoekmckoijdlc/content-scripts/content.css".
ry @ content.js:59
iy @ content.js:58
main @ content.js:90
(anonymous) @ content.js:90
(anonymous) @ content.js:90
(anonymous) @ content.js:90
model-detection.ts:59 [ModelDetection] Ollama not available: internal error; reference = b1ouhum369fqfucaso5tmr8i
model-detection.ts:70 [ModelDetection] Found 0 Ollama models: []
model-detection.ts:84 [ModelDetection] Checking LM Studio at http://localhost:1234
model-detection.ts:46 Fetch finished loading: GET "http://localhost:3000/api/detect-models?provider=ollama&baseUrl=http%3A%2F%2Flocalhost%3A11434".
detectOllamaModels @ model-detection.ts:46
detectAndUpdateLocalModels @ model-store.ts:394
(anonymous) @ __root.tsx:90
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
(anonymous) @ react-dom-client.development.js:17923
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:88 Fetch finished loading: GET "http://localhost:3000/api/detect-models?provider=lmstudio&baseUrl=http%3A%2F%2Flocalhost%3A1234".
detectLMStudioModels @ model-detection.ts:88
detectAndUpdateLocalModels @ model-store.ts:426
await in detectAndUpdateLocalModels
(anonymous) @ __root.tsx:90
react_stack_bottom_frame @ react-dom-client.development.js:25989
runWithFiberInDEV @ react-dom-client.development.js:871
commitHookEffectListMount @ react-dom-client.development.js:13249
commitHookPassiveMountEffects @ react-dom-client.development.js:13336
commitPassiveMountOnFiber @ react-dom-client.development.js:15484
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15504
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15476
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15718
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:15439
commitPassiveMountOnFiber @ react-dom-client.development.js:15519
flushPassiveEffects @ react-dom-client.development.js:18432
(anonymous) @ react-dom-client.development.js:17923
performWorkUntilDeadline @ scheduler.development.js:45
<RootDocument>
exports.jsxs @ react-jsx-runtime.development.js:349
MatchImpl @ Match.tsx:99
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
updateSimpleMemoComponent @ react-dom-client.development.js:9830
updateMemoComponent @ react-dom-client.development.js:9763
beginWork @ react-dom-client.development.js:12204
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchImpl>
exports.jsx @ react-jsx-runtime.development.js:335
MatchesInner @ Matches.tsx:93
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<MatchesInner>
exports.jsx @ react-jsx-runtime.development.js:335
Matches @ Matches.tsx:69
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Matches>
exports.jsx @ react-jsx-runtime.development.js:335
RouterProvider @ RouterProvider.tsx:75
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<RouterProvider>
exports.jsx @ react-jsx-runtime.development.js:335
children @ StartClient.tsx:16
AwaitInner @ awaited.tsx:57
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<AwaitInner>
exports.jsx @ react-jsx-runtime.development.js:335
Await @ awaited.tsx:42
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Await>
exports.jsx @ react-jsx-runtime.development.js:335
StartClient @ StartClient.tsx:14
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:871
performUnitOfWork @ react-dom-client.development.js:17641
workLoopConcurrentByScheduler @ react-dom-client.development.js:17635
renderRootConcurrent @ react-dom-client.development.js:17617
performWorkOnRoot @ react-dom-client.development.js:16503
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<StartClient>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:335
(anonymous) @ client.tsx:9
exports.startTransition @ react.development.js:1158
(anonymous) @ client.tsx:5
model-detection.ts:112 [ModelDetection] Found 15 LM Studio models: (15) ['nanbeige4.1-3b-heretic', 'text-embedding-kalm-embedding-gemma3-12b-2511', 'text-embedding-nomic-embed-text-v1.5@q4_k_m', 'mistralai/ministral-3-3b', 'qwen/qwen3-1.7b', 'google/gemma-3-1b', 'qwen/qwen3-4b-thinking-2507', 'qwen/qwen3-4b-2507', 'resume-model', 'gemma-3-270m-it', 'text-embedding-nomic-embed-text-v1.5-embedding', 'text-embedding-qwen3-embedding-0.6b', 'text-embedding-mxbai-embed-large-v1', 'text-embedding-nomic-embed-code', 'text-embedding-nomic-embed-text-v1.5@f32']
__root.tsx:98 [App] Detected LM Studio models: (15) ['nanbeige4.1-3b-heretic', 'text-embedding-kalm-embedding-gemma3-12b-2511', 'text-embedding-nomic-embed-text-v1.5@q4_k_m', 'mistralai/ministral-3-3b', 'qwen/qwen3-1.7b', 'google/gemma-3-1b', 'qwen/qwen3-4b-thinking-2507', 'qwen/qwen3-4b-2507', 'resume-model', 'gemma-3-270m-it', 'text-embedding-nomic-embed-text-v1.5-embedding', 'text-embedding-qwen3-embedding-0.6b', 'text-embedding-mxbai-embed-large-v1', 'text-embedding-nomic-embed-code', 'text-embedding-nomic-embed-text-v1.5@f32']
__root.tsx:100 [App] Active provider: custom-1772910472827 | Active model: nanbeige4.1-3b-heretic
__root.tsx:101 [Security] API keys are stored securely in Convex, not in browser localStorage


-----------
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
useSearchProgress.ts:144 Fetch finished loading: GET "http://localhost:3000/api/csrf-token".
EventSource finished loading: GET "http://localhost:3000/api/search/progress?searchId=search-1772914437801&token=9c945d6…".
useSearchProgress.ts:199 Fetch finished loading: POST "http://localhost:3000/api/search/stream".
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
EventSource finished loading: GET "http://localhost:3000/api/search/progress?searchId=search-1772914437801&token=9c945d6…".
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
EventSource finished loading: GET "http://localhost:3000/api/search/progress?searchId=search-1772914437801&token=9c945d6…".
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
EventSource finished loading: GET "http://localhost:3000/api/search/progress?searchId=search-1772914437801&token=9c945d6…".
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)

content_script.js:1 Uncaught TypeError: Cannot read properties of null (reading 'deref')
    at MutationObserver.<anonymous> (content_script.js:1:440606)
﻿

import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar, Footer, Connect, ErrorFallback, Loader } from "./components";
import { ErrorBoundary } from "react-error-boundary";
const Home = lazy(() => import("./Pages/Home"));
const AdminDashboard = lazy(() => import("./Pages/AdminDashboard"));
const PrivateEditor = lazy(() => import("./Pages/PrivateEditor"));
const ReadPublished = lazy(() => import("./Pages/ReadPublished"));
const PublicEditor = lazy(() => import("./Pages/PublicEditor"));
const UserDashboard = lazy(() => import("./Pages/UserDashboard"));
const CategoryPage = lazy(() => import("./Pages/CategoryPage"));
const PublishedItem = lazy(() => import("./Pages/PublishedItem"));
const CreatorPage = lazy(() => import("./Pages/CreatorPage"));
const EditProfile = lazy(() => import("./Pages/EditProfile"));
const Page404 = lazy(() => import("./Pages/Page404"));

const App = () => {

const reloadPage = () => {
  window.location.reload();
};



  return (
    <div className="min-h-screen">
      <div className="bg-field-bg">
        <Navbar />
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => reloadPage()}
        >
          <Suspense
            fallback={
              <>
                <Loader/>
              </>
            }
          >
            <Routes>
              <Route path="/connect" element={<Connect />} />
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/private-pager" element={<PrivateEditor />} />
              <Route
                path="/read-published/:id/:title/:creator"
                element={<ReadPublished />}
              />
              <Route path="/publish-pager" element={<PublicEditor />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route
                path="/category/:label/pagers"
                element={<CategoryPage />}
              />
              <Route
                path="/published-item/:id/:title/:category"
                element={<PublishedItem />}
              />
              <Route path="/creator" element={<CreatorPage />} />
              <Route
                path="/creator/:id/:creatorAddress/:creator"
                element={<CreatorPage />}
              />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/*" element={<Page404 />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </div>
    </div>
  );
};

export default App;

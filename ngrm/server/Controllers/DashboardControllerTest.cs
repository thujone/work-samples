using System.Security.Principal;
using Moq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NGRM.Domain.Interfaces.Services;
using NGRM.Web.Controllers.Api;
using NGRM.Web.Test.Extensions;
using Microsoft.AspNetCore.Mvc;


namespace NGRM.Web.Test.Controllers.Api
{
    [TestClass]
    public class DashboardControllerTest
    {
        private DashboardController _dashboardController;
        private Mock<IDashboardService> _mockDashboardService;
        private Mock<IAccessService> _mockAccessService;

        [TestInitialize]
        public void SetUp()
        {
            _mockAccessService = new Mock<IAccessService>();
            _mockDashboardService = new Mock<IDashboardService>();

            SetUpMocks();

            _dashboardController = new DashboardController(_mockAccessService.Object, _mockDashboardService.Object);
        }

        [TestMethod]
        public void ShouldGetDashboard()
        {
            var engagementId = 1;
            var chartSet = "dashboard";

            _dashboardController.Get(chartSet, engagementId);
            _mockDashboardService.Verify(ds => ds.Get(chartSet, engagementId), Times.Once);
        }

        [TestMethod]
        public void ShouldNotAllowGetDashboard()
        {
            var chartSet = "dashboard";

            _mockAccessService.Setup(x => x.AllowGetRisk(It.IsAny<IPrincipal>(), It.IsAny<int>()))
                .Returns(false);
            var result = _dashboardController.Get(chartSet, 1);
            Assert.IsNotNull(result);
            _mockDashboardService.Verify(x => x.Get(chartSet, 1), Times.Never);
        }

        [TestMethod]
        public void ShouldHaveAuthorizeAttributes()
        {
            var authorizeAttribute = _dashboardController.GetAuthorizeAttribute();
            Assert.IsNotNull(authorizeAttribute);
        }

        [TestMethod]
        public void ShouldHaveRoutingAttributes()
        {
            var routePrefix = _dashboardController.GetClassRouteAttribute();
            Assert.AreEqual(routePrefix.Template, "api/Dashboard");

            var getDashboardRoute = _dashboardController.GetRouteAttribute("Get", new[] { typeof(int) });
            Assert.AreEqual(getDashboardRoute.Template, "{engagementId}");
        }

        [TestMethod]
        public void ShouldHaveHttpActionAttributes()
        {
            var getDashboardHttpAction = _dashboardController.GetHttpActionAttribute<HttpGetAttribute>("Get", new[] { typeof(int) });
            Assert.IsInstanceOfType(getDashboardHttpAction, typeof(HttpGetAttribute));
        }

        private void SetUpMocks()
        {
            _mockAccessService.Setup(x => x.AllowGetRisk(It.IsAny<IPrincipal>(), It.IsAny<int>()))
                .Returns(true);
        }
    }
}

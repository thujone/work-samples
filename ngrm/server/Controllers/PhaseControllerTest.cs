using System.Linq;
using System.Security.Principal;
using FluentValidation.Results;
using Moq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NGRM.Domain.Interfaces.Services;
using NGRM.Domain.Interfaces.Validators;
using NGRM.Domain.Model;
using NGRM.Web.Controllers.Api;
using NGRM.Web.Test.Extensions;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace NGRM.Web.Test.Controllers.Api
{
    [TestClass]
    public class PhaseControllerTest
    {
        private Mock<IPhaseService> _mockPhaseService;
        private Mock<IPhaseValidator> _mockPhaseValidator;
        private Mock<IAccessService> _mockAccessService;
        private PhaseController _phaseController;
        private List<Phase> _phaseList;

        [TestInitialize]
        public void SetUp()
        {
            _mockAccessService = new Mock<IAccessService>();
            _mockPhaseService = new Mock<IPhaseService>();
            _mockPhaseValidator = new Mock<IPhaseValidator>();
            _phaseList = new List<Phase>();

            SetUpMocks();

            _phaseController = new PhaseController(_mockAccessService.Object, _mockPhaseService.Object,
                _mockPhaseValidator.Object);
        }

        [TestMethod]
        public void ShouldGetPhases()
        {
            _phaseList.Add(new Phase { Id = 1 });
            _phaseList.Add(new Phase { Id = 2 });

            var result = _phaseController.Get(1).ToList();
            _mockPhaseService.Verify(ps => ps.GetPhases(1), Times.Once);
            Assert.AreEqual(2, result[0].Id);
            Assert.AreEqual(1, result[1].Id);
        }

        [TestMethod]
        public void ShouldGetPhase()
        {
            var phase = _phaseController.Get(2, 1);
            _mockPhaseService.Verify(ps => ps.Get(1), Times.Once);
            Assert.AreNotEqual(0, phase.ThreatLevels.Count);
        }

        [TestMethod]
        public void ShouldAddPhaseWhenValid()
        {
            var phase = new Phase();
            _mockPhaseValidator.Setup(tv => tv.Validate(phase))
                .Returns(new ValidationResult());
            _phaseController.Post(phase);
            _mockPhaseService.Verify(ts => ts.Add(phase), Times.Once);
        }

        [TestMethod]
        public void ShouldNotPostPhaseWhenNotValid()
        {
            var phase = new Phase();
            _mockPhaseValidator.Setup(tv => tv.Validate(phase))
                .Returns(new ValidationResult { Errors = { new ValidationFailure("propertyName", "error") } });
            _phaseController.Post(phase);
            _mockPhaseService.Verify(ts => ts.Add(phase), Times.Never);
        }

        [TestMethod]
        public void ShouldReturnPhaseOnSuccess()
        {
            var phase = new Phase();
            _mockAccessService.Setup(service => service.AllowPostPhase(It.IsAny<IPrincipal>(), It.IsAny<int>()))
                .Returns(true);
            _mockPhaseValidator.Setup(tv => tv.Validate(phase))
                .Returns(new ValidationResult());
            var result = _phaseController.Post(phase) as OkObjectResult;
            Assert.AreEqual(phase, result?.Value);
        }

        [TestMethod]
        public void ShouldDeletePhase()
        {
            _mockPhaseService.Setup(x => x.Get(1))
                .Returns(new Phase());
            _phaseController.Delete(1);
            _mockPhaseService.Verify(ps => ps.Remove(1), Times.Once);
        }

        [TestMethod]
        public void ShouldNotAllowGetPhaseList()
        {
            _mockAccessService.Setup(x => x.AllowGetPhase(It.IsAny<IPrincipal>(), It.IsAny<int>()))
                .Returns(false);
            var result = _phaseController.Get(1);
            Assert.AreEqual(0, result.Count());
            _mockPhaseService.Verify(x => x.GetPhases(1), Times.Never);
        }

        [TestMethod]
        public void ShouldNotAllowGetPhase()
        {
            _mockAccessService.Setup(x => x.AllowGetPhase(It.IsAny<IPrincipal>(), It.IsAny<int>()))
                .Returns(false);
            var result = _phaseController.Get(1, 2);
            Assert.IsNotNull(result);
            _mockPhaseService.Verify(x => x.Get(2), Times.Never);
        }

        [TestMethod]
        public void ShouldNotAllowPost()
        {
            _mockAccessService.Setup(x => x.AllowPostPhase(It.IsAny<IPrincipal>(), It.IsAny<int>()))
                .Returns(false);
            var result = _phaseController.Post(new Phase()) as StatusCodeResult;
            Assert.IsInstanceOfType(result, typeof(StatusCodeResult));
            Assert.AreEqual(403, result.StatusCode);
            _mockPhaseService.Verify(x => x.Add(It.IsAny<Phase>()), Times.Never);
            _mockPhaseService.Verify(x => x.Update(It.IsAny<Phase>()), Times.Never);
        }

        [TestMethod]
        public void ShouldNotAllowDelete()
        {
            _mockAccessService.Setup(x => x.AllowDeletePhase(It.IsAny<IPrincipal>(), It.IsAny<int>()))
                .Returns(false);
            _mockPhaseService.Setup(x => x.Get(1))
                .Returns(new Phase());
            _phaseController.Delete(1);
            _mockPhaseService.Verify(x => x.Remove(1), Times.Never);
        }

        [TestMethod]
        public void ShouldHaveAuthorizeAttributes()
        {
            var authorizeAttribute = _phaseController.GetAuthorizeAttribute();
            Assert.IsNotNull(authorizeAttribute);
        }

        [TestMethod]
        public void ShouldHaveRoutingAttributes()
        {
            var routePrefix = _phaseController.GetClassRouteAttribute();
            Assert.AreEqual(routePrefix.Template, "api/Phase");

            var getPhaseListRoute = _phaseController.GetRouteAttribute("Get", new[] { typeof(int) });
            Assert.AreEqual(getPhaseListRoute.Template, "{engagementId}");

            var getPhaseRoute = _phaseController.GetRouteAttribute("Get", new[] { typeof(int), typeof(int) });
            Assert.AreEqual(getPhaseRoute.Template, "{engagementId}/{phaseId}");

            var deleteRoute = _phaseController.GetRouteAttribute("Delete", new[] { typeof(int) });
            Assert.AreEqual(deleteRoute.Template, "{phaseId}");
        }

        [TestMethod]
        public void ShouldHaveHttpActionAttributes()
        {
            var getPhaseListHttpAction = _phaseController.GetHttpActionAttribute<HttpGetAttribute>("Get",
                new[] { typeof(int) });
            Assert.IsInstanceOfType(getPhaseListHttpAction, typeof(HttpGetAttribute));

            var getPhaseHttpAction = _phaseController.GetHttpActionAttribute<HttpGetAttribute>("Get",
                new[] { typeof(int), typeof(int) });
            Assert.IsInstanceOfType(getPhaseHttpAction, typeof(HttpGetAttribute));

            var postHttpAction = _phaseController.GetHttpActionAttribute<HttpPostAttribute>("Post",
                new[] { typeof(Phase) });
            Assert.IsInstanceOfType(postHttpAction, typeof(HttpPostAttribute));

            var deleteHttpAction = _phaseController.GetHttpActionAttribute<HttpDeleteAttribute>("Delete",
                new[] { typeof(int) });
            Assert.IsInstanceOfType(deleteHttpAction, typeof(HttpDeleteAttribute));
        }

        private void SetUpMocks()
        {
            _mockAccessService.Setup(x => x.AllowGetPhase(It.IsAny<IPrincipal>(), It.IsAny<int>()))
                .Returns(true);
            _mockAccessService.Setup(x => x.AllowPostPhase(It.IsAny<IPrincipal>(), It.IsAny<int>()))
                .Returns(true);
            _mockAccessService.Setup(x => x.AllowDeletePhase(It.IsAny<IPrincipal>(), It.IsAny<int>()))
                .Returns(true);

            _mockPhaseService.Setup(x => x.GetPhases(It.IsAny<int>()))
                .Returns(_phaseList);
            _mockPhaseService.Setup(x => x.Get(It.IsAny<int>()))
                .Returns(new Phase());
        }
    }
}

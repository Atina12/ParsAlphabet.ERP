using System.Xml;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.Report;
using Enum = System.Enum;

namespace ParsAlphabet.ERP.Application.Common;

public static class CIS
{
    public static string GenerateInsuranceArmed(HeaderArmedInsurance header, List<AdmissionInsurerReportPreview> data)
    {
        if (data.Count == 0)
            return string.Empty;


        var doc = new XmlDocument();

        XmlNode root = doc.CreateElement("Y");

        var hRChild = doc.CreateElement("HR");

        var hr_dc = doc.CreateElement("DC");
        hr_dc.InnerText = header.ArmedInsuranceIdentity;

        var hr_dn = doc.CreateElement("DN");
        hr_dn.InnerText = header.CompanyName;

        var hr_rc = doc.CreateElement("RC");
        hr_rc.InnerText = header.DataLength.ToString();

        var hr_fd = doc.CreateElement("FD");
        hr_fd.InnerText = header.FromDate;

        var hr_td = doc.CreateElement("TD");
        hr_td.InnerText = header.ToDate;

        var hr_cr = doc.CreateElement("CR");
        hr_cr.InnerText = header.CompanyPhoneNo;

        hRChild.AppendChild(hr_dc);
        hRChild.AppendChild(hr_dn);
        hRChild.AppendChild(hr_rc);
        hRChild.AppendChild(hr_fd);
        hRChild.AppendChild(hr_td);
        hRChild.AppendChild(hr_cr);

        root.AppendChild(hRChild);

        var xChild = doc.CreateElement("X");

        var len = data.Count;
        var line = new AdmissionInsurerReportPreview();

        var groupAdmission = (from x in data
            group x by new
            {
                x.Id,
                x.RowNumberAdmission,
                x.ReserveDatePersian,
                x.BasicInsurerExpirationDatePersian,
                x.BasicInsurerLineId,
                x.BasicInsurerNo,
                x.GenderId,
                x.BasicInsurerBookletPageNo,
                x.MSC
            }
            into gx
            select new AdmissionInsurerReportPreview
            {
                Id = gx.Key.Id,
                RowNumberAdmission = gx.Key.RowNumberAdmission,
                ReserveDatePersian = gx.Key.ReserveDatePersian,
                BasicInsurerExpirationDatePersian = gx.Key.BasicInsurerExpirationDatePersian,
                BasicInsurerLineId = gx.Key.BasicInsurerLineId,
                BasicInsurerNo = gx.Key.BasicInsurerNo,
                GenderId = gx.Key.GenderId,
                BasicInsurerBookletPageNo = gx.Key.BasicInsurerBookletPageNo,
                MSC = gx.Key.MSC
            }).ToList();

        var lenAdmission = groupAdmission.Count;
        var rowNumber = 0;
        for (var i = 0; i < lenAdmission; i++)
        {
            xChild = doc.CreateElement("X");
            line = groupAdmission[i];
            rowNumber = i + 1;

            var x_ph = doc.CreateElement("PH");
            var x_by = doc.CreateElement("BY");

            var x_ph_sq = doc.CreateElement("SQ");
            var x_ph_nd = doc.CreateElement("ND");
            var x_ph_rd = doc.CreateElement("RD");
            var x_ph_vd = doc.CreateElement("VD");
            var x_ph_pt = doc.CreateElement("PT");
            var x_ph_sn = doc.CreateElement("SN");
            var x_ph_gr = doc.CreateElement("GR");
            var x_ph_rn = doc.CreateElement("RN");
            var x_ph_pg = doc.CreateElement("PG");
            var x_ph_pc = doc.CreateElement("PC");
            var x_ph_dd = doc.CreateElement("DD");
            var x_ph_pp = doc.CreateElement("PP");
            var x_ph_is = doc.CreateElement("IS");
            var x_ph_ps = doc.CreateElement("PS");

            x_ph_sq.InnerText = line.RowNumberAdmission.ToString();
            x_ph_nd.InnerText = line.ReserveDatePersian.Replace("/", string.Empty);
            x_ph_rd.InnerText = line.ReserveDatePersian.Replace("/", string.Empty);
            x_ph_vd.InnerText = line.BasicInsurerExpirationDatePersian != string.Empty
                ? line.BasicInsurerExpirationDatePersian.Replace("/", string.Empty)
                : "";
            x_ph_pt.InnerText = EquivalentInsuranceBoxWithArmedInsurance(line.BasicInsurerLineId);
            x_ph_sn.InnerText = line.BasicInsurerNo;
            x_ph_gr.InnerText = line.GenderId == 2 ? "0" : "1";
            x_ph_rn.InnerText = line.BasicInsurerBookletPageNo;
            x_ph_pg.InnerText = "1";
            x_ph_pc.InnerText = line.MSC;

            var sumPP = data.Where(d => d.Id == line.Id).Sum(x => x.ServiceActualAmount);
            x_ph_pp.InnerText = sumPP.ToString();

            var sumIS = data.Where(d => d.Id == line.Id).Sum(x => x.BasicShareAmount);
            x_ph_is.InnerText = sumIS.ToString();

            var sumPS = data.Where(d => d.Id == line.Id).Sum(x => x.PatientShareAmount);
            x_ph_ps.InnerText = sumPS.ToString();

            x_ph.AppendChild(x_ph_sq);
            x_ph.AppendChild(x_ph_nd);
            x_ph.AppendChild(x_ph_rd);
            x_ph.AppendChild(x_ph_vd);
            x_ph.AppendChild(x_ph_pt);
            x_ph.AppendChild(x_ph_sn);
            x_ph.AppendChild(x_ph_gr);
            x_ph.AppendChild(x_ph_rn);
            x_ph.AppendChild(x_ph_pg);
            x_ph.AppendChild(x_ph_pc);
            x_ph.AppendChild(x_ph_dd);
            x_ph.AppendChild(x_ph_pp);
            x_ph.AppendChild(x_ph_is);
            x_ph.AppendChild(x_ph_ps);

            xChild.AppendChild(x_ph);

            var lines = data.Where(a => a.Id == groupAdmission[i].Id).ToList();
            var lineCount = lines.Count();

            if (lineCount > 1)
            {
                var a = 0;
                var b = a + 1;
            }


            var x_by_mh = doc.CreateElement("MH");

            for (var i1 = 0; i1 < lineCount; i1++)
            {
                var lineDetail = lines[i1];

                x_by_mh = doc.CreateElement("MH");
                var x_by_mh_mg = doc.CreateElement("MG");
                var x_by_mh_md = doc.CreateElement("MD");
                var x_by_mh_mr = doc.CreateElement("MR");
                var x_by_mh_mp = doc.CreateElement("MP");
                var x_by_mh_mi = doc.CreateElement("MI");
                var x_by_mh_ms = doc.CreateElement("MS");

                x_by_mh_mg.InnerText = lineDetail.Code == 0 ? 90000.ToString() : lineDetail.Code.ToString();
                x_by_mh_md.InnerText = lineDetail.Qty.ToString();
                x_by_mh_mr.InnerText = "1";
                x_by_mh_mp.InnerText = lineDetail.ServiceActualAmount.ToString();
                x_by_mh_mi.InnerText = lineDetail.BasicShareAmount.ToString();
                x_by_mh_ms.InnerText = lineDetail.PatientShareAmount.ToString();

                x_by_mh.AppendChild(x_by_mh_mg);
                x_by_mh.AppendChild(x_by_mh_md);
                x_by_mh.AppendChild(x_by_mh_mr);
                x_by_mh.AppendChild(x_by_mh_mp);
                x_by_mh.AppendChild(x_by_mh_mi);
                x_by_mh.AppendChild(x_by_mh_ms);

                x_by.AppendChild(x_by_mh);
            }

            xChild.AppendChild(x_by);
            root.AppendChild(xChild);
        }

        doc.AppendChild(root);

        return doc.XmlToString();
    }

    public static string XmlToString(this XmlDocument xmlDoc)
    {
        using (var sw = new StringWriter())
        {
            using (var tx = new XmlTextWriter(sw))
            {
                tx.Formatting = Formatting.Indented;
                xmlDoc.WriteTo(tx);
                var strXmlText = sw.ToString();
                return strXmlText;
            }
        }
    }

    public static string EquivalentInsuranceBoxWithArmedInsurance(int boxId)
    {
        if (boxId == 8000)
            return "103";
        if (boxId == 8001)
            return "105";
        if (boxId == 8002)
            return "104";
        return "";
    }

    public static List<MyDropDownViewModel> EnumReimbursmentList()
    {
        var list = Enum.GetValues(typeof(AdmissionReimbursmentEnumerator))
            .Cast<AdmissionReimbursmentEnumerator>()
            .Select(t => new MyDropDownViewModel
            {
                Id = (int)t,
                Name = t.AdmissionReimbursmentDisplayName()
            }).ToList();

        return list;
    }
}
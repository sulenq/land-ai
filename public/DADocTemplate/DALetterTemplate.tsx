import { CContainer } from "@/components/ui/c-container";
import { PSerif } from "@/components/ui/p";
import { Box, Flex, StackProps, Table } from "@chakra-ui/react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 72,
    fontFamily: "Times-Roman",
    fontSize: 12,
    lineHeight: 1.4,
  },
  titleCenter: {
    textAlign: "center",
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: 8,
  },
  row: { flexDirection: "row", marginBottom: 2 },
  label: { width: 120 },
  value: { flex: 1 },
  sectionTitle: {
    textAlign: "center",
    fontWeight: "bold",
    textDecoration: "underline",
    marginVertical: 8,
  },
  paragraph: { marginBottom: 4, textAlign: "justify" },
  signatureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  signatureBox: { flex: 1, alignItems: "center" },
  signatureText: { marginTop: 60 },
});

interface Props_SuratKuasa {
  data: {
    grantorName: string;
    grantorBirthPlaceDate: string;
    grantorNik: string;
    grantorAddress: string;
    granteeName: string;
    granteeBirthPlaceDate: string;
    granteeNIK: string;
    granteeAddress: string;
    city: string;
    subject: string;
    road: string;
    village: string;
    district: string;
    titleNumber: string;
    area: string;
    dateStamp: string;
  };
}
export const SuratKuasaPDF = ({ data }: Props_SuratKuasa) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.titleCenter}>SURAT KUASA</Text>

      <Text style={styles.paragraph}>Yang bertanda-tangan di bawah ini :</Text>

      {/* Grantor */}
      <View style={styles.row}>
        <Text style={styles.label}>Nama</Text>
        <Text>: {data.grantorName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tempat/Tanggal Lahir</Text>
        <Text>: {data.grantorBirthPlaceDate}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>NIK</Text>
        <Text>: {data.grantorNik}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Alamat</Text>
        <Text>: {data.grantorAddress}</Text>
      </View>

      <Text style={[styles.paragraph, { marginTop: 4 }]}>
        Dengan ini memberi kuasa kepada :
      </Text>

      {/* Grantee */}
      <View style={styles.row}>
        <Text style={styles.label}>Nama</Text>
        <Text>: {data.granteeName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tempat/Tanggal Lahir</Text>
        <Text>: {data.granteeBirthPlaceDate}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>NIK</Text>
        <Text>: {data.granteeNIK}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Alamat</Text>
        <Text>: {data.granteeAddress}</Text>
      </View>

      <Text style={styles.sectionTitle}>KHUSUS</Text>

      <Text style={styles.paragraph}>
        Untuk dan atas nama pemberi kuasa menghadap di Kantor Pertanahan{" "}
        {data.city} permohonan {data.subject} dan melakukan segala sesuatu
        berkaitan dengan tersebut menerima sertipikatnya dari Kantor Pertanahan{" "}
        {data.city} atas bidang tanah terletak di :
      </Text>

      {/* Land info */}
      <View style={styles.row}>
        <Text style={styles.label}>Jalan</Text>
        <Text>: {data.road}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Kelurahan</Text>
        <Text>: {data.village}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Kecamatan</Text>
        <Text>: {data.district}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Kota</Text>
        <Text>: {data.city}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Nomor Hak</Text>
        <Text>: {data.titleNumber}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Luas</Text>
        <Text>: {data.area}</Text>
      </View>

      <Text style={[styles.paragraph, { marginTop: 8 }]}>
        Demikian Surat Kuasa ini dibuat dengan sebenar-benarnya dan dapat
        dipergunakan sebagaimana mestinya.
      </Text>

      <Text style={{ textAlign: "right", marginTop: 12 }}>
        {`${data.city}, ${data.dateStamp}`}
      </Text>

      {/* Signatures */}
      <View style={styles.signatureContainer}>
        <View style={styles.signatureBox}>
          <Text>Penerima Kuasa :</Text>
          <Text style={styles.signatureText}>{`(${data.granteeName})`}</Text>
        </View>

        <View style={styles.signatureBox}>
          <Text>Pemberi Kuasa :</Text>
          <Text style={styles.signatureText}>{`(${data.grantorName})`}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

interface Props_SuratPermohonan {
  data: {
    city: string;

    applicantName: string;
    applicantOccupation: string;
    applicantAddress: string;

    principalName: string;
    principalOccupation: string;
    principalNik: string;
    principalAddress: string;

    noSuratKuasa: string;
    suratKuasaDate: string;

    subject: string;

    landLocation: string;
    village: string;
    district: string;
    province: string;
    titleNumber: string;

    dateStamp: string;
  };
}
export const SuratPermohonanPDF = ({ data }: Props_SuratPermohonan) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={{ fontWeight: "bold" }}>
        <Text>Sdr.</Text>

        <Text style={{ marginTop: 4 }}>Kepada Yth,</Text>
        <Text>Kepala Kantor Pertanahan</Text>
        <Text>{data.city}</Text>
        <Text style={{ marginBottom: 12 }}>Di {data.city}</Text>
      </View>

      <Text style={styles.paragraph}>Dengan Hormat,</Text>
      <Text style={styles.paragraph}>Yang bertandatangan dibawah ini :</Text>

      {/* Applicant */}
      <View
        style={{
          marginLeft: 24,
        }}
      >
        <View style={styles.row}>
          <Text style={styles.label}>Nama</Text>
          <Text>: {data.applicantName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Pekerjaan</Text>
          <Text>: {data.applicantOccupation}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Alamat</Text>
          <Text>: {data.applicantAddress}</Text>
        </View>
      </View>

      <Text style={[styles.paragraph, { marginTop: 6 }]}>
        Dalam hal ini bertindak untuk dan atas nama diri sendiri / selaku kuasa
        dari :
      </Text>

      {/* Principal */}
      <View
        style={{
          marginLeft: 24,
        }}
      >
        <View style={styles.row}>
          <Text style={styles.label}>Nama</Text>
          <Text>: {data.principalName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Pekerjaan</Text>
          <Text>: {data.principalOccupation}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>No. KTP/SIM</Text>
          <Text>: {data.principalNik}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Alamat</Text>
          <Text>: {data.principalAddress}</Text>
        </View>
      </View>

      <Text style={[styles.paragraph, { marginTop: 6 }]}>
        Berdasarkan Surat Kuasa Nomor {data.noSuratKuasa} tanggal{" "}
        {data.suratKuasaDate} dengan ini mengajukan permohonan :
      </Text>

      <Text
        style={[styles.paragraph, { fontWeight: "bold", marginVertical: 4 }]}
      >
        {data.subject}
      </Text>

      <Text style={styles.paragraph}>
        dan melakukan segala sesuatu berkaitan dengan pengurusan tersebut serta
        menerima Sertipikatnya dari Kantor Pertanahan {data.city} atas bidang
        tanah yang terletak di :
      </Text>

      {/* Land Info */}

      <View
        style={{
          marginLeft: 24,
        }}
      >
        <View style={styles.row}>
          <Text style={styles.label}>Letak tanah</Text>
          <Text>: {data.landLocation}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kelurahan</Text>
          <Text>: {data.village}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kecamatan</Text>
          <Text>: {data.district}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Wilayah</Text>
          <Text>: {data.province}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nomor Hak</Text>
          <Text>: {data.titleNumber}</Text>
        </View>
      </View>

      <Text style={[styles.paragraph, { marginTop: 8 }]}>
        Untuk melengkapi permohonan dimaksud, bersama ini kami lampirkan :
      </Text>

      <Text style={{ marginLeft: 12, marginTop: 4 }}>
        1. Asli Sertifikat HM {data.titleNumber}
      </Text>
      <Text style={{ marginLeft: 12 }}>2.</Text>
      <Text style={{ marginLeft: 12 }}>3.</Text>

      <Text style={{ textAlign: "right", marginTop: 16 }}>
        {`${data.city}, ${data.dateStamp}`}
      </Text>

      <Text style={{ textAlign: "right", marginTop: 12 }}>Hormat Kami</Text>

      <Text style={{ textAlign: "right", marginTop: 40 }}>
        {data.applicantName}
      </Text>
    </Page>
  </Document>
);

interface Props_SuratPernyataan {
  data: {
    name: string;
    occupation: string;
    address: string;
    nik: string;

    titleType: string;
    titleNumber: string;
    certificateSerialNumber: string;
    registeredOwner: string;

    province: string;
    city: string;
    district: string;
    village: string;
    road: string;

    imgDate: string;
    imgNumber: string;
    nib: string;
    area: string;

    dateStamp: string;
  };
}
export const SuratPernyataanPDF = ({ data }: Props_SuratPernyataan) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.titleCenter}>SURAT PERNYATAAN</Text>

      <Text style={styles.paragraph}>Yang bertandatangan di bawah ini :</Text>

      {/* Identity */}
      <View style={styles.row}>
        <Text style={styles.label}>Nama</Text>
        <Text>: {data.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Pekerjaan</Text>
        <Text>: {data.occupation}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Alamat</Text>
        <Text>: {data.address}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>KTP/NIK</Text>
        <Text>: {data.nik}</Text>
      </View>

      <Text style={[styles.paragraph, { marginTop: 8 }]}>
        Dengan ini menyatakan bahwa :
      </Text>

      {/* Point 1 */}
      <Text style={styles.paragraph}>
        1. Saya adalah pemegang hak atas tanah dengan data sebagai berikut :
      </Text>

      <View style={{ marginLeft: 12 }}>
        <View style={styles.row}>
          <Text style={styles.label}>a. Jenis Hak</Text>
          <Text>: {data.titleType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>b. Nomor</Text>
          <Text>: {data.titleNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>c. Nomor Seri Blanko</Text>
          <Text>: {data.certificateSerialNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>d. Atas Nama</Text>
          <Text>: {data.registeredOwner}</Text>
        </View>

        <Text style={{ marginTop: 4 }}>e. Letak Tanah :</Text>

        <View style={{ marginLeft: 12 }}>
          <View style={styles.row}>
            <Text style={styles.label}>Provinsi</Text>
            <Text>: {data.province}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Kota</Text>
            <Text>: {data.city}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Kecamatan</Text>
            <Text>: {data.district}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Kelurahan</Text>
            <Text>: {data.village}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Jalan</Text>
            <Text>: {data.road}</Text>
          </View>
        </View>

        <Text style={{ marginTop: 4 }}>f. Gambar Situasi :</Text>

        <View style={{ marginLeft: 12 }}>
          <View style={styles.row}>
            <Text style={styles.label}>Tanggal</Text>
            <Text>: {data.imgDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nomor</Text>
            <Text>: {data.imgNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>NIB</Text>
            <Text>: {data.nib}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Luas</Text>
            <Text>: {data.area}</Text>
          </View>
        </View>
      </View>

      {/* Point 2-5 */}
      <Text style={styles.paragraph}>
        2. Saya menjamin keaslian sertipikat tersebut dan nama yang tercantum
        dalam sertipikat merupakan nama pemegang hak yang sebenarnya dan
        beritikad baik serta bertanggung jawab sepenuhnya atas penggunaan data
        yang diakses.
      </Text>

      <Text style={styles.paragraph}>
        3. Saya menjamin bahwa hak atas tanah tersebut benar milik saya dan
        tidak ada orang/pihak lain yang turut memiliki atau ikut mempunyai
        sesuatu hak pun di atasnya, serta tidak tersangkut dalam suatu sengketa,
        bebas dari sitaan.
      </Text>

      <Text style={styles.paragraph}>
        4. Saya menjamin bahwa surat bukti hak atas tanah tersebut adalah
        satu-satunya yang sah/tidak pernah dipalsukan dan tidak pernah dibuat
        duplikatnya oleh instansi yang berwenang atas permintaan saya.
      </Text>

      <Text style={styles.paragraph}>
        5. Apabila pernyataan ini tidak benar, maka saya bertanggung jawab
        secara perdata maupun pidana tanpa melibatkan pihak Kantor Pertanahan.
      </Text>

      <Text style={[styles.paragraph, { marginTop: 8 }]}>
        Demikian Surat Pernyataan ini dibuat untuk dipergunakan sebagaimana
        mestinya.
      </Text>

      <Text style={{ textAlign: "right", marginTop: 16 }}>
        {`${data.city}, ${data.dateStamp}`}
      </Text>

      <Text style={{ textAlign: "right", marginTop: 12 }}>Hormat Saya</Text>

      <Text style={{ textAlign: "right", marginTop: 40 }}>{data.name}</Text>
    </Page>
  </Document>
);

// DOM to PDF(img) purpose
interface Props__SuratKuasa extends StackProps {
  data: {
    grantorName: string;
    grantorBirthPlaceDate: string;
    grantorNik: string;
    grantorAddress: string;
    granteeName: string;
    granteeBirthPlaceDate: string;
    granteeNIK: string;
    granteeAddress: string;
    city: string;
    subject: string;
    road: string;
    village: string;
    district: string;
    titleNumber: string;
    area: string;
    dateStamp: string;
  };
}
export const SuratKuasa = (props: Props__SuratKuasa) => {
  const { data, ...restProps } = props;

  return (
    <CContainer w="21cm" p="2.5cm" bg="white" color="black" {...restProps}>
      <PSerif
        textAlign="center"
        fontWeight="bold"
        fontSize="lg"
        textDecor="underline !important"
        mb={4}
      >
        SURAT KUASA
      </PSerif>

      <PSerif mb={2}>Yang bertanda-tangan di bawah ini :</PSerif>

      <Table.Root mb={4}>
        <Table.Body>
          <Table.Row bg="white">
            <Table.Cell w="180px" py={1}>
              <PSerif lineHeight={1.2}>Nama</PSerif>
            </Table.Cell>
            <Table.Cell w="10px" py={1}>
              <PSerif lineHeight={1.2}>:</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>{data.grantorName}</PSerif>
            </Table.Cell>
          </Table.Row>

          <Table.Row bg="white">
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>Tempat/Tanggal Lahir</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>:</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>{data.grantorBirthPlaceDate}</PSerif>
            </Table.Cell>
          </Table.Row>

          <Table.Row bg="white">
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>NIK</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>:</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>{data.grantorNik}</PSerif>
            </Table.Cell>
          </Table.Row>

          <Table.Row bg="white">
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>Alamat</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>:</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>{data.grantorAddress}</PSerif>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      <PSerif mb={2}>Dengan ini memberi kuasa kepada :</PSerif>

      <Table.Root mb={4}>
        <Table.Body>
          <Table.Row bg="white">
            <Table.Cell w="180px" py={1}>
              <PSerif lineHeight={1.2}>Nama</PSerif>
            </Table.Cell>
            <Table.Cell w="10px" py={1}>
              <PSerif lineHeight={1.2}>:</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>{data.granteeName}</PSerif>
            </Table.Cell>
          </Table.Row>

          <Table.Row bg="white">
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>Tempat/Tanggal Lahir</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>:</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>{data.granteeBirthPlaceDate}</PSerif>
            </Table.Cell>
          </Table.Row>

          <Table.Row bg="white">
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>NIK</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>:</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>{data.granteeNIK}</PSerif>
            </Table.Cell>
          </Table.Row>

          <Table.Row bg="white">
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>Alamat</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>:</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>{data.granteeAddress}</PSerif>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      <PSerif
        textAlign="center"
        fontWeight="bold"
        fontSize="lg"
        textDecor="underline !important"
        my={4}
      >
        KHUSUS
      </PSerif>

      <PSerif mb={4} lineHeight={1.3}>
        {`Untuk dan atas nama pemberi kuasa menghadap di Kantor Pertanahan <b>${data.city}</b> permohonan <b>${data.subject}</b> dan melakukan segala sesuatu berkaitan dengan tersebut menerima sertipikatnya dari Kantor Pertanahan <b>${data.city}</b> atas bidang tanah terletak di :`}
      </PSerif>

      <Table.Root mb={4}>
        <Table.Body>
          <Table.Row bg="white">
            <Table.Cell w="180px" py={1}>
              <PSerif lineHeight={1.2}>Jalan</PSerif>
            </Table.Cell>
            <Table.Cell w="10px" py={1}>
              <PSerif lineHeight={1.2}>:</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>{data.road}</PSerif>
            </Table.Cell>
          </Table.Row>

          <Table.Row bg="white">
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>Kelurahan</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>:</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>{data.village}</PSerif>
            </Table.Cell>
          </Table.Row>

          <Table.Row bg="white">
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>Kecamatan</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>:</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>{data.district}</PSerif>
            </Table.Cell>
          </Table.Row>

          <Table.Row bg="white">
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>Kota</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>:</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>{data.city}</PSerif>
            </Table.Cell>
          </Table.Row>

          <Table.Row bg="white">
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>Nomor Hak</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>:</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>{data.titleNumber}</PSerif>
            </Table.Cell>
          </Table.Row>

          <Table.Row bg="white">
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>Luas</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>:</PSerif>
            </Table.Cell>
            <Table.Cell py={1}>
              <PSerif lineHeight={1.2}>{data.area}</PSerif>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      <PSerif mb={6} lineHeight={1.3}>
        Demikian Surat Kuasa ini dibuat dengan sebenar-benarnya dan dapat
        dipergunakan sebagaimana mestinya.
      </PSerif>

      <PSerif ml="auto">{`${data.city}, ${data.dateStamp}`}</PSerif>

      <Flex justify="space-between" mt={6}>
        <Box>
          <PSerif mb={20}>Penerima Kuasa :</PSerif>
          <PSerif>{`<b>(${data.granteeName})</b>`}</PSerif>
        </Box>

        <Box>
          <PSerif mb={20}>Pemberi Kuasa :</PSerif>
          <PSerif>{`<b>(${data.grantorName})</b>`}</PSerif>
        </Box>
      </Flex>
    </CContainer>
  );
};

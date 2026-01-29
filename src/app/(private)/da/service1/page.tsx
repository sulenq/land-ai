"use client";

import { CContainer } from "@/components/ui/c-container";

export default function Page() {
  const ID = "da_service1";

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      coverLetter: [],
      certificate: [],
      auctionSchedule: [],
      powerOfAttonery: [],
    },
    validationSchema: yup.object().shape({
      coverLetter: fileValidation({
        allowedExtensions: ["pdf"],
        maxSizeMB: 10,
      }).required(l.msg_required_form),
      certificate: fileValidation({
        allowedExtensions: ["pdf"],
        maxSizeMB: 10,
      }),
      auctionSchedule: fileValidation({
        allowedExtensions: ["pdf"],
        maxSizeMB: 10,
      }),
      powerOfAttonery: fileValidation({
        allowedExtensions: ["pdf"],
        maxSizeMB: 10,
      }),
    }),
    onSubmit: (values) => {
      const payload = new FormData();

      payload.append("coverLetter", values.coverLetter[0]);
      payload.append("certificate", values.certificate[0]);
      payload.append("auctionSchedule", values.auctionSchedule[0]);
      payload.append("powerOfAttonery", values.powerOfAttonery[0]);

      const config = {
        url: DA_API_SERVICE1,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: (r) => {
            const result = r.data?.data?.result;

            console.debug(result);
          },
        },
      });
    },
  });

  return (
    <PageContainer className="scrollY" p={4}>
      <ContainerLayout>
        <PageTitle p={0} m={0} mb={4} />

        <CContainer
          gap={4}
          p={4}
          bg={"bg.subtle"}
          rounded={themeConfig.radii.container}
          border={"1px solid"}
          borderColor={"border.muted"}
          mb={8}
        >
          <form id={ID} onSubmit={formik.handleSubmit}>
            <FieldsetRoot>
              <HStack wrap={"wrap"} gap={4}>
                <Field label={l.cover_letter} flex={"1 1 300px"}>
                  <FileInput
                    dropzone
                    inputValue={formik.values.certificate}
                    onChange={(inputValue) => {
                      formik.setFieldValue("certificate", inputValue);
                    }}
                  />
                </Field>

                <Field label={l.certificate} flex={"1 1 300px"} optional>
                  <FileInput dropzone disabled />
                </Field>

                <Field label={l.auction_schedule} flex={"1 1 300px"} optional>
                  <FileInput dropzone disabled />
                </Field>

                <Field label={l.power_of_attorney} flex={"1 1 300px"} optional>
                  <FileInput dropzone disabled />
                </Field>
              </HStack>
            </FieldsetRoot>
          </form>

          <Btn type="submit" form={ID} loading={loading}>
            {l.analyze}
          </Btn>
        </CContainer>

        <CContainer minH={"100px"}>
          <P fontSize={"xl"}>{l.result}</P>
        </CContainer>
      </ContainerLayout>
    </PageContainer>
  );
}
